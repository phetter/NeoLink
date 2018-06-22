// neon.js - neon-js api module

import Neon, { u, wallet, api, tx } from '@cityofzion/neon-js'
import { toNumber } from '../math'
import { logDeep } from '../debug'
import base58 from 'bs58'

export const getAccountName = (account, accounts) => {
  let result

  Object.keys(accounts).forEach(address => {
    if (address === account.address) {
      result = accounts[address].label
    }
  })

  return result
}

export const validateLength = (input, minLength) => {
  if (!input || input.length < minLength) return false
  return true
}

export const labelExists = (label, accounts) => {
  const labelExists = Object.keys(accounts)
    .map(account => {
      return accounts[account].label
    })
    .find(accountLabel => accountLabel.toLowerCase() === label.toLowerCase())

  return !!labelExists
}

export const getBalance = (networks, network, account) => {
  return new Promise((resolve, reject) => {
    api[networks[network].apiType]
      .getBalance(networks[network].url, account.address)
      .then(results => {
        let amounts
        if (results.address === 'not found') {
          amounts = {
            neo: 0,
            gas: 0,
          }
        } else {
          const neo = results.assets['NEO'] ? Number(results.assets['NEO'].balance.c[0]) : 0
          const gasAmount = results.assets['GAS'] ? results.assets['GAS'].balance.c : 0
          const gas = formatGas(gasAmount)

          amounts = {
            neo,
            gas,
          }
        }
        resolve(amounts)
      })
      .catch(error => reject(error))
  }).catch(error => console.log(error))
}

export const getTransactions = (networks, network, account) => {
  return new Promise((resolve, reject) => {
    api[networks[network].apiType]
      .getTransactionHistory(networks[network]['url'], account.address)
      .then(results => {
        resolve(results)
      })
      .catch(error => {
        if (error.message === 'Cannot read property \'length\' of null') {
          resolve([])
        }
        reject(error)
      })
  })
}

export const formatGas = gasArray => {
  let gas
  if (gasArray.length === 1) {
    gas = gasArray[0] / 100000000000000
  } else {
    gas = gasArray[1] > 0 ? Number(gasArray.join('.')).toFixed(5) : Number(gasArray.join('.'))
  }

  return gas
}

export const truncateString = (string, len) => (string.length >= len ? string.slice(0, len - 3) + '...' : string)

export function callInvoke (networkUrl, account, input) {
  return new Promise((resolve, reject) => {
    if (!Neon.CONST.ASSET_ID[input.assetType]) {
      reject(new Error('Invalid asset type specified'))
    }

    const myAccount = Neon.create.account(account.wif)

    const parsedArgs = input.args.map(arg => {
      if (wallet.isAddress(arg)) return u.reverseHex(wallet.getScriptHashFromAddress(arg))
      if (typeof arg === 'string') return u.str2hexstring(arg)
      if (typeof arg === 'number') return u.int2hex(arg)
    })

    const config = {
      net: networkUrl,
      script: Neon.create.script({
        scriptHash: input.scriptHash,
        operation: input.operation,
        args: parsedArgs,
      }),
      address: myAccount.address,
      privateKey: myAccount.privateKey,
      intents: [{
        assetId: Neon.CONST.ASSET_ID[input.assetType],
        value: toNumber(input.assetAmount),
        scriptHash: input.scriptHash,
      }],
      gas: 0,
    }

    Neon.doInvoke(config)
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

