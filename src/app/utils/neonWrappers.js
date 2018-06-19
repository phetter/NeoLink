import Neon, { u, wallet } from '@cityofzion/neon-js'
import { toNumber } from './math'

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
