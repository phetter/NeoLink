// Neoscan.js
// This contains utility helpers for accessing Neoscan API

// TODO abstract api choice into an api config option and dynamically map to selected at runtime
// TODO composable url retrieval

import axios from 'axios'

// import { Fixed8 } from '../math'
// import { logDeep } from '../debug'

import Promise from 'bluebird'

// TODO Reintegrate this (neoscanIni bits) with state tree

let neoscanIni = {}

neoscanIni.active = {}
neoscanIni.mainNet = {}
neoscanIni.mainNet.rootUrl = 'https://neoscan.io/api/main_net/'
neoscanIni.mainNet.txByIdUrl = 'https://neoscan.io/api/main_net/v1/get_transaction/'
neoscanIni.mainNet.txsByAddressUrl = 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
neoscanIni.mainNet.balanceUrl = 'https://neoscan.io/api/main_net/v1/get_balance/'

neoscanIni.testNet = {}
neoscanIni.testNet.rootUrl = 'https://neoscan-testnet.io/api/test_net/'
neoscanIni.testNet.txByIdUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/'
neoscanIni.testNet.txsByAddressUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/'
neoscanIni.testNet.balanceUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_balance/'

// Stub this out for any custom net that may come along.
// Rather than make these an array, let's create them by a custom name right on the object - neoscainIni.myCustom, for example
// Then just set neoscanIni.active to that entry.
// Store the whole thing for later management.
neoscanIni.custom = {}
neoscanIni.custom.rootUrl = 'https://neoscan-testnet.io/api/test_net/'
neoscanIni.testNet.txByIdUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/'
neoscanIni.testNet.txsByAddressUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/'
neoscanIni.testNet.balanceUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_balance/'

let curState = {}

// ../storage.js adds this as a subscriber to listen for state changes.
// I'm not sure this is the right approach as we still can't sync state yet.
// TODO figure out how to sync state and do this whole bit properly
export const syncState = state => {
  curState = state
}

// Check if our url is properly formed. If url can't construct it in try, it isn't.
const validateUrl = url => {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url)
      console.log('host: ' + u)
      resolve(url)
    } catch (error) {
      console.log('neoscan: validateUrl: ' + error.message)
      reject(error)
    }
  })
}

export const setNet = networkId => {
  return switchNetwork(networkId)
}

// MAKE GAS PERDY

export const formatGas = gasArray => {
  let gas
  if (gasArray.length === 1) {
    gas = gasArray[0] / 100000000000000
  } else {
    gas = gasArray[1] > 0 ? Number(gasArray.join('.')).toFixed(5) : Number(gasArray.join('.'))
  }

  return gas
}

export const switchNetwork = networkId => {
  let net
  switch (networkId) {
    case 'MainNet':
      if (curState && curState.config && curState.config.neoscan) {
        net = curState.config.neoscan.active = curState.config.neoscan.mainNet
      } else {
        curState = {
          config: {
            neoscan: {
              active: neoscanIni.mainNet,
            },
          },
        }
        net = curState.config.neoscan.active
      }
      break
    case 'TestNet':
      if (curState && curState.config && curState.config.neoscan) {
        net = curState.config.neoscan.active = curState.config.neoscan.testNet
      } else {
        curState = {
          config: {
            neoscan: {
              active: neoscanIni.testNet,
            },
          },
        }
        net = curState.config.neoscan.active
      }
      break
    default:
      // TODO need to write this case to properly handle custom networks in neoscan
      // pseudo:
      // loop over curState looking for a curState.config.neoscan['custom_name_literal'] that matches networkId
      // build the json object if it isn't built.
      // set net and active to the matched net
      // return the net if we found one, return null if not
      return undefined
  }
  return net
}

// Returns the full URL all the way up to the version.
// I.e., 'https://neoscan.io/api/main_net/'

export const getRootUrl = () => {
  return validateUrl(curState.config.neoscan.active.rootUrl)
}

// Returns the full URL all the way up to the args.
// I.e., 'https://neoscan.io/api/main_net/v1/get_transaction/'

export const getTxByIdUrl = txid => {
  if (txid) {
    return validateUrl(curState.config.neoscan.active.txByIdUrl + '/' + txid + '/')
  } else {
    return validateUrl(curState.config.neoscan.active.txByIdUrl)
  }
}

// Returns the full URL all the way up to the args.
// I.e., 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
// TODO add page argument format = address + '/' + page

export const getTxsByAddressUrl = address => {
  if (address) return validateUrl(curState.config.neoscan.active.txsByAddressUrl + '/' + address + '/')
  else return validateUrl(curState.config.neoscan.active.txsByAddressUrl)
}

// Returns the full URL all the way up to the args.
// I.e., 'https://neoscan.io/api/main_net/v1/get_transaction/'
// TODO getBalanceUrl curState.config is broken. It won't always stay synced with data,
// resulting in failing calls. I've added a failsafe to use the literal string as a fallback
// until we can fix the underlying issue.

export const getBalanceUrl = address => {
  console.log(curState.config.neoscan.active.balanceUrl, address)
  if (address) {
    return validateUrl(curState.config.neoscan.active.balanceUrl + '/' + address + '/')
  } else return validateUrl(curState.config.neoscan.active.balanceUrl)
}

// Get all transactions for an address

export const getTxsByAddress = address => {
  return new Promise((resolve, reject) => {
    getTxsByAddressUrl(address).then(url => {
      console.log(url)
      return axios
        .get(url)
        .then(response => {
          console.log(`Retrieved History for ${address} from neoscan ${url}`)
          response.data.address = address
          resolve({ data: response.data, address: address })
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

// Get a single transaction

export const getTxById = txid => {
  return new Promise((resolve, reject) => {
    getTxByIdUrl(txid).then(url => {
      console.log(`Retrieving ${txid} History from neoscan ${url}`)
      return axios
        .get(url)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

export const getBalance = address => {
  return new Promise((resolve, reject) => {
    getBalanceUrl(address).then(url => {
      console.log(`Retrieving balance for ${address} from neoscan ${url}`)
      return axios
        .get(url)
        .then(response => {
          let amounts, neo, gas
          let data = response.data
          if (data.address === 'not found') {
            amounts = {
              neo: 0,
              gas: 0,
            }
          } else {
            data.balance.map(b => {
              switch (b.asset) {
                case 'NEO':
                  neo = b.amount
                  break
                case 'GAS':
                  gas = '' + b.amount
                  break
              }
            })

            amounts = {
              neo: neo,
              gas: gas,
            }
          }
          resolve(amounts)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

export const parseUnspent = unspentArr => {
  return unspentArr.map(coin => {
    return {
      index: coin.n,
      txid: coin.txid,
      value: coin.value,
    }
  })
}

// TODO: implement change code from TransactionList/index.js here to hide business from pres
// function parseTxHistory (rawTxs, address) {
//   return rawTxs.map(tx => {
//     const vin = tx.vin.filter(i => i.address_hash === address)
//     const vout = tx.vouts.filter(o => o.address_hash === address)
//     const change = {
//       NEO: vin.filter(i => i.asset === Neon.CONST.ASSET_ID.NEO).reduce((p, c) => p.add(c.value), new Fixed8(0)),
//       GAS: vout.filter(i => i.asset === Neon.CONST.ASSET_ID.GAS).reduce((p, c) => p.add(c.value), new Fixed8(0))
//     }
//       txid: tx.txid,
//       blockHeight: new Fixed8(tx.block_height),
//       change
//     }
//   })
// }
