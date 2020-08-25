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
import 'regenerator-runtime/runtime';
import test from './test'
import {
  combineReducersOptimistic,
  createStoreOptimistic} from 'redux-optimistic/dist/es'

import config from "../optimisticrc"


const appReducer = combineReducersOptimistic({
  test
});


const store = createStoreOptimistic(appReducer, config)


export {store}
