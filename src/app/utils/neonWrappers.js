import Neon, { api, tx } from '@cityofzion/neon-js'
import { toNumber } from './math'
import { logDeep } from './debug'
import base58 from 'bs58'
// import { wallet } from '@cityofzion/neon-js/src/index'

export function callInvoke (networkUrl, account, input) {
  return new Promise((resolve, reject) => {
    if (!Neon.CONST.ASSET_ID[input.assetType]) {
      reject(new Error('Invalid asset type specified'))
    }

    const txArgs = [input.arg1, input.arg2]
    const args = []
    txArgs.forEach((arg) => {
      if (arg) {
        args.push(arg)
      }
    })

    const myAccount = Neon.create.account(account.wif)

    const config = {
      net: networkUrl,
      privateKey: myAccount.privateKey,
      address: myAccount.address,
      intents: [{
        assetId: Neon.CONST.ASSET_ID[input.assetType],
        value: toNumber(input.amount),
        scriptHash: input.scriptHash,
      }],
      script: { scriptHash: input.scriptHash, operation: input.operation, args: args },
      gas: 0,
    }

    api.doInvoke(config)
      .then(res => resolve(res))
      .catch(e => reject(e))
  })
}

/**
 * @param {string} address
 * @return {string}
 */
export const getScriptHashFromAddress = (address) => {
  let hash = Neon.u.ab2hexstring(base58.decode(address))
  return Neon.u.reverseHex(hash.substr(2, 40))
}

// TODO may as well move this to neoscanapi
/**
 * Send an asset to an address
 * @param {string} netUrl - 'MainNet' or 'TestNet'.
 * @param {string} toAddress - The destination address.
 * @param {string} from - Private Key or WIF of the sending address.
 * @param {{NEO: number, GAS: number}} assetAmounts - The amount of each asset (NEO and GAS) to send, leave empty for 0.
 * @param {function} [signingFunction] - Optional signing function. Used for external signing.
 * @return {Promise<Response>} RPC Response
 */
export const sendAsset = (netUrl, toAddress, account, wif, assetAmounts, remark, txFee, signingFunction) => {
  // = (net, toAddress, from, assetAmounts, signingFunction) => {
  let fee

  if (txFee) fee = txFee
  else fee = 0

  const rpcEndpointPromise = api.neoscan.getRPCEndpoint(netUrl)

  const balancePromise = api.neoscan.getBalance(netUrl, account.address)

  // logDeep('account: ', account)

  const scriptHash = getScriptHashFromAddress(toAddress)

  logDeep('scriptHash: ', scriptHash)
  logDeep('remark: ', remark)

  const intents = Object.keys(assetAmounts).map(key => {
    return {
      assetId: Neon.CONST.ASSET_ID[key],
      value: assetAmounts[key],
      scriptHash: scriptHash,
    }
  })
  let signedTx
  // let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then(values => {
      // endpt = values[0]
      const balance = values[1]
      // const unsignedTx = tx.Transaction.createContractTx(balance, intents)
      const unsignedTx = tx.Transaction.createContractTx(balance, intents, {}, fee)
      // const unsignedTx = tx.Transaction.createContractTx(balance, intents, {}, fee)

      let uTx = unsignedTx.addRemark(remark)

      logDeep('unsignedTx: ', uTx)

      // if (signingFunction) {
      //   return signingFunction(unsignedTx, fromAcct.publicKey)
      // } else {
      //   return unsignedTx.sign(fromAcct.privateKey)
      // }
      const myAccount = Neon.create.account(wif)
      return unsignedTx.sign(myAccount.privateKey)
    })
    .then(signedResult => {
      signedTx = signedResult
      logDeep('signedTx: ', signedTx)
      const client = Neon.create.rpcClient(netUrl)
      return client.sendRawTransaction(signedTx)
    })
    .then(res => {
      logDeep('tx Result: ', res)
      if (res === true) {
        res.txid = signedTx.hash
      } else {
        console.log(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}
