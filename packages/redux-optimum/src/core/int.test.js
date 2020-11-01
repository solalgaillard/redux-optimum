import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import sagasFromConfig from './generate-sagas';
import HttpClient from '../http-client';
/* eslint-disable import/named, no-unused-vars */
import { __RewireAPI__ as processQueues } from './process-queues';

/* Can't mock via provider cause it's a factory - use REWIRE instead of set */
processQueues.__set__('aSpecificSelectorToBeMocked', () => false);

const aSpecificSelectorToBeMocked = processQueues.__get__(
  'aSpecificSelectorToBeMocked',
);

/* eslint-enable import/named, no-unused-vars */

describe('processOperation Unit Testing', () => {
  const config = {
    operations: [
      {
        actionType: 'SIMPLE_REQUEST_SUCCESS',
        APICallSettings: {
          endpoint: () => 'SIMPLE_REQUEST_200_URL',
          method: 'get',
          requestParameters: {
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
          },
          payload: () => {},
        },
        needToBeLoggedIn: false,
        sendsAccessToken: 'none', // none, header, query, body
        mode: 'every', // or latest, -> just take latest call or queue all calls
        HTTPCodesRefreshToken: [], // List of HTTP codes, -1 for browser
        // failures
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], // default // empty no retries
        clearAfterAllRetriesFailed: false,
        stages: {
          begin: {
            actionType: 'SIMPLE_REQUEST_SUCCESS_BEGIN',
            payload: payload => payload,
          },
          success: {
            actionType: 'SIMPLE_REQUEST_SUCCESS_SUCCESS',
            payload: () => {},
          },
          failure: {
            actionType: 'SIMPLE_REQUEST_SUCCESS_FAILURE',
            payload: () => ({ test: 'test' }),
          },
        },

      },
    ],
    credentialManagement: {
      loggedInSelector: () => true,
      getAccessToken: () => {
        const token = localStorage.getItem('prefer');
        return { prefer: token || 'code=401' };
      }, // return tok in obj
      getRefreshToken: () => ({ Authorization: 1234 }), // return tok in obj
      sendsRefreshToken: 'header',
      refreshingTokenCallDetails: {
        endpoint: 'Token/REFRESH_URL',
        method: 'get',
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], // default // empty no retries
        requestPayload: null,
        requestParameters: {
          headers: { 'Content-Type': 'application/json' }, // used
          // for logged in
          // Content-Type
          mode: 'cors',
        },
      }, // => make api call // Depending on mode, it sends the token with key
      uponReceivingFreshToken: () => {
        localStorage.setItem('prefer', 'code=200');
      }, // to store token
    },
  };

  it('test With Basic Config', async () => {
    await expectSaga(sagasFromConfig, config)
      .provide([
        [matchers.call.fn(HttpClient), { response: 'awesome', error: null }],
      ])
      .put({
        type: 'SIMPLE_REQUEST_SUCCESS_BEGIN',
        payload: { id: 42, name: 'Tucker' },
      })
      .put({
        type: 'QueueManager/ADD_TO_QUEUE/SIMPLE_REQUEST_SUCCESS',
        operation: config.operations[0],
        originalActionPayload: { payload: { id: 42, name: 'Tucker' } },
        storeWhenDispatching: undefined,
      })
      .put({
        type: 'QueueManager/REMOVE_FROM_QUEUE/SIMPLE_REQUEST_SUCCESS',
        actionType: 'SIMPLE_REQUEST_SUCCESS',
      })
      .put({ type: 'SIMPLE_REQUEST_SUCCESS_SUCCESS' })
      .dispatch({
        type: 'SIMPLE_REQUEST_SUCCESS',
        payload: { id: 42, name: 'Tucker' },
      })
      .silentRun();
  });

  it('check Effect with Reducer', async () => {
    const initialState = {
      name: 'Tucker',
      age: 11,
    };

    function reducer(state = initialState, action) {
      if (action.type === 'SIMPLE_REQUEST_SUCCESS_SUCCESS') {
        return {
          ...state,
          age: state.age + 1,
        };
      }
      return state;
    }

    await expectSaga(sagasFromConfig, config)
      .provide([
        [matchers.call.fn(HttpClient), { response: 'awesome', error: null }],
      ])
      .withReducer(reducer)
      .hasFinalState({
        name: 'Tucker',
        age: 12, // <-- age changes in store state
      })

      .dispatch({
        type: 'SIMPLE_REQUEST_SUCCESS',
        payload: { id: 42, name: 'Tucker' },
      })
      .silentRun();
  });
});
