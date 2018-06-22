import * as Neoscan from './api/neoscan'

function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) })
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState)
    store.subscribe(() => {
      const state = store.getState()
      saveState(state)
    })

    store.subscribe(() => {
      Neoscan.syncState(store.getState())
    })

    return store
  }
}
