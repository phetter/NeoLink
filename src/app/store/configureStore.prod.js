import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import storage from '../utils/storage'
import createHistory from 'history/createBrowserHistory'
import { connectRouter, routerMiddleware } from 'connected-react-router'

export const history = createHistory()

const enhancer = compose(
  applyMiddleware(...[thunk, routerMiddleware(history)]),
  storage()
)

export default function(initialState) {
  if (initialState.router && initialState.router.location) {
    history.location = initialState.router.location
  }

  return createStore(connectRouter(history)(rootReducer), initialState, enhancer)
}
