import * as types from '../constants/ActionTypes'

export function addCustomNetwork(name, url, txUrl, apiType) {
  return { type: types.ADD_CUSTOM_NETWORK, name, url, txUrl, apiType }
}

export function editCustomNetwork(name, url, txUrl, apiType, id) {
  return { type: types.EDIT_CUSTOM_NETWORK, name, url, txUrl, apiType, id }
}

export function deleteCustomNetwork(id) {
  return { type: types.DELETE_CUSTOM_NETWORK, id }
}

export function setNetwork(id) {
  return { type: types.SWITCH_NETWORK, id }
}

export function addTransactionRemark(transactionId, remark) {
  return { type: types.ADD_TRANSACTION_REMARK, transactionId, remark }
}

export function editTransactionRemark(transactionId, remarkId) {
  return { type: types.EDIT_TRANSACTION_REMARK, transactionId, remarkId }
}

export function deleteTransactionRemark(remarkId) {
  return { type: types.DELETE_TRANSACTION_REMARK, remarkId }
}
