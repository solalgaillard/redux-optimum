/* eslint-disable */
//-------------------------------------------------------------------------------
// Contains all reducers for the Redux store.
//
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Constants
//-------------------------------------------------------------------------------

import { get } from 'lodash';
import types from './types';

const reducer = (state= "null", action) => {
  switch (action.type) {
    case "TEST":
      return action.type;
    case "TEST_BEGIN":
      return action;
    case "TEST_SUCCESS":
      return action;
    case "TEST_FAILURE":
      return action;
    default:
      return state;
  };
}

export default reducer;

