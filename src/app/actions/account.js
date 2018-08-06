import * as types from '../constants/ActionTypes'

export function setAccount(wif, address) {
  return { type: types.SET_ACCOUNT, wif, address }
}

export function setBalance(results) {
  return { type: types.SET_BALANCE, results }
}

export function setTransactions(transactions) {
  return { type: types.SET_TRANSACTIONS, transactions }
}

export function logOut() {
  return { type: types.LOG_OUT }
}
