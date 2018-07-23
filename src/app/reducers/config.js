import uuidv4 from 'uuid/v4'

import * as ActionTypes from '../constants/ActionTypes'

// TODO rewrite URL parsing with a better system such host slug breakout:
// TODO make composable
const initialState = {
  networks: {
    MainNet: {
      name: 'MainNet',
      url: 'https://neoscan.io/api/main_net/',
      rootUrl: 'https://neoscan.io/api/main_net/',
      txUrl: 'https://neoscan.io/api/main_net/v1/get_transaction/',
      txByIdUrl: 'https://neoscan.io/api/main_net/v1/get_transaction/',
      txsUrl: 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/',
      txsByAddressUrl: 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/',
      balanceUrl: 'https://neoscan.io/api/main_net/v1/get_balance/',
      canDelete: false,
      apiType: 'neoscan' },
    TestNet: {
      name: 'TestNet',
      url: 'https://neoscan-testnet.io/api/test_net/',
      rootUrl: 'https://neoscan-testnet.io/api/test_net/',
      txUrl: 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/',
      txByIdUrl: 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/',
      txsUrl: 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/',
      txsByAddressUrl: 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/',
      balanceUrl: 'https://neoscan-testnet.io/api/test_net/v1/get_balance/',
      canDelete: false,
      apiType: 'neoscan' },
    CoZTestNet: {
      name: 'CoZ TestNet',
      url: 'https://coz.neoscan-testnet.io/api/main_net',
      txUrl: 'https://coz.neoscan-testnet.io/api/main_net/v1/get_transaction/',
      canDelete: false,
      apiType: 'neoscan',
    },
  },
  selectedNetworkId: 'MainNet',
}

const actionsMap = {
  [ActionTypes.SWITCH_NETWORK](state, action) {
    return {
      ...state,
      selectedNetworkId: action.id,
    }
  },
  [ActionTypes.ADD_CUSTOM_NETWORK](state, action) { // TODO fix add custom network code to work with composable config
    const networks = { ...state.networks }
    networks[action.name] = {
      name: action.name,
      url: action.url,
      txUrl: action.txUrl,
      canDelete: true,
      apiType:
      action.apiType }

    return {
      ...state,
      networks,
    }
  },
  [ActionTypes.EDIT_CUSTOM_NETWORK](state, action) {
    const networks = { ...state.networks }
    const objectName = Object.keys(networks).find(network => networks[network].name === action.id)
    console.log(objectName, networks[objectName])
    networks[objectName].name = action.name
    networks[objectName].url = action.url
    networks[objectName].txUrl = action.txUrl
    networks[objectName].apiType = action.apiType

    return {
      ...state,
      networks,
    }
  },
  [ActionTypes.DELETE_CUSTOM_NETWORK](state, action) {
    const networks = { ...state.networks }
    delete networks[action.id]

    return {
      ...state,
      networks,
    }
  },
}

export default function config(state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state
  return reduceFn(state, action)
}
