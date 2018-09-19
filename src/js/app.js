import React from 'react'
import ReactDOM from 'react-dom'
import Root from '../app/Root'

// TODO add API neon-js settings configuration if using neon-js

chrome.storage.local.get('stateVersion', stateVersion => {
  chrome.storage.local.get('state', obj => {
    const { state } = obj

    let initialState = JSON.parse(state || '{}')

    let initialStateVersion = JSON.parse('{}')
    if (!initialStateVersion.version || initialStateVersion.version < 1) {
      initialState = upgradeToStateVersion1(initialState)
      chrome.storage.local.set({ stateVersion: JSON.stringify({ version: 1 }) })
    }

    const createStore = require('../app/store/configureStore').default

    const container = document.querySelector('#container')
    const isPopupWindow = container.classList.contains('popup')

    ReactDOM.render(<Root store={ createStore(initialState) } isPopupWindow={ isPopupWindow } />, container)
  })
})

// Moved defaults from neondb to neoscan.
// TODO MORE COMPOSABLE
// TODO break down root url and compose against api version variable
// TODO distinguish between neoscan api url and site url

function upgradeToStateVersion1(initialState) {
  if (initialState && initialState.config && initialState.config.networks) {
    Object.keys(initialState.config.networks).forEach(function(key) {
      if (initialState.config.networks[key].apiType === 'neonDB') {
        initialState.config.networks[key].apiType = 'neondb'
      }
      if (initialState.config.networks[key].apiType === 'neoscan') {
        initialState.config.networks[key].apiType = 'neoscan'
        initialState.config.neoscan = {}
        initialState.config.neoscan.active = {}
        initialState.config.neoscan.mainNet = {}
        initialState.config.neoscan.mainNet.rootUrl = initialState.config.networks[key].url = 'https://neoscan.io/api/main_net/'
        initialState.config.neoscan.mainNet.addressUrl = initialState.config.networks[key].addressUrl = 'https://neoscan.io/address/'
        initialState.config.neoscan.mainNet.txSiteUrl = initialState.config.networks[key].txSiteUrl = 'https://neoscan.io/transaction/'
        initialState.config.neoscan.mainNet.txByIdUrl = initialState.config.networks[key].txUrl = 'https://neoscan.io/api/main_net/v1/get_transaction/'
        initialState.config.neoscan.mainNet.txsByAddressUrl = initialState.config.networks[key].txsUrl = 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
        initialState.config.neoscan.mainNet.balanceUrl = initialState.config.networks[key].balanceUrl = 'https://neoscan.io/api/main_net/v1/get_balance/'
        initialState.config.neoscan.testNet = {}
        initialState.config.neoscan.testNet.rootUrl = initialState.config.networks[key].url = 'https://neoscan-testnet.io/api/test_net/'
        initialState.config.neoscan.testNet.addressUrl = initialState.config.networks[key].addressUrl = 'https://neoscan-testnet.io/address/'
        initialState.config.neoscan.testNet.txSiteUrl = initialState.config.networks[key].txSiteUrl = 'https://neoscan-testnet.io/transaction/'
        initialState.config.neoscan.testNet.txByIdUrl = initialState.config.networks[key].txUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/'
        initialState.config.neoscan.testNet.txsByAddressUrl = initialState.config.networks[key].txsUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/'
        initialState.config.neoscan.testNet.balanceUrl = initialState.config.networks[key].balanceUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_balance/'
      } else {
        initialState.config.networks[key].apiType = 'custom'
      }
    })
  }

  return initialState
}
