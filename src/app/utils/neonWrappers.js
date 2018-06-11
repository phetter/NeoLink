import Neon, { api, u, sc, wallet} from '@cityofzion/neon-js'
import { toNumber } from './math'

export function callInvoke (networkUrl, account, input) {
  return new Promise((resolve, reject) => {
    if (!Neon.CONST.ASSET_ID[input.assetType]) {
      reject(new Error('Invalid asset type specified'))
    }

    const myAccount = Neon.create.account(account.wif)

    const parsedArgs = input.args.map(arg => u.str2hexstring(arg))

    // const finalArgs = [
    //   sc.ContractParam.string("my_id"),
    //   sc.ContractParam.byteArray("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y", "address"),
    // ];

    const finalArgs = [
      u.str2hexstring("my_id"),
      u.str2hexstring("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y"),
    ];

    console.log(finalArgs);

    const config = {
      net: networkUrl,
      script: Neon.create.script({
        scriptHash: input.scriptHash,
        operation: input.operation,
        args: finalArgs
      }),
      address: myAccount.address,
      privateKey: myAccount.privateKey,
      intents: [{
        assetId: Neon.CONST.ASSET_ID[input.assetType],
        value: toNumber(input.assetAmount),
        scriptHash: input.scriptHash,
      }],
      gas: 0,
    };

    console.log(config);

    Neon.doInvoke(config)
      .then(res => resolve(res))
      .catch(e => reject(e))
  })
}
