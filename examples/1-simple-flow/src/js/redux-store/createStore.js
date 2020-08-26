/* eslint-disable */
//-------------------------------------------------------------------------------
// Initialize the redux store and load redux-thunk as middleware.
//
//
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------
import 'regenerator-runtime/runtime'; //Need it ?
import lastActionDispatched from './actions-dispatched'
import {
  combineReducersOptimistic,
  createStoreOptimistic} from 'redux-optimum/dist/es'

import config from "../optimisticrc"


const appReducer = combineReducersOptimistic({
  lastActionDispatched
});


const store = createStoreOptimistic(appReducer, config)


export {store}
