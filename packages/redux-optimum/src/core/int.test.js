import {expectSaga} from "redux-saga-test-plan";
import * as matchers from 'redux-saga-test-plan/matchers';
import sagasFromConfig, {__RewireAPI__ as generateSagas} from './generate-sagas'
import HttpClient from "../http-client";
import {__RewireAPI__ as processQueues} from "./process-queues";

/* Can't mock via provider cause it's a factory*/
processQueues.__set__('aSpecificSelectorToBeMocked', function() {
  return false
});

const aSpecificSelectorToBeMocked = processQueues.__get__("aSpecificSelectorToBeMocked")

  describe('processOperation Unit Testing', () => {


  const config = {
    //Add default for every operations.
    operations : [
      {
        actionType: "SIMPLE_REQUEST_SUCCESS",
        APICallSettings: {
          endpoint: (originalActionPayload, store) => 'SIMPLE_REQUEST_200_URL',
          method: 'get',
          requestParameters: {
            headers: {"Content-Type": "application/json"}, //used for logged in //Content-Type
            //credentials: 'include', //cookie credential optional
            mode: 'cors'
          },
          payload: (originalActionPayload, store) => //(
          {
            //object_id: '98',
            //phone_number: "tresfsdf",
          }
          //),
        },
        needToBeLoggedIn: false,
        sendsAccessToken: "none", //none, header, query, body
        mode: "every", // or latest, -> just take latest call or queue all calls
        HTTPCodesRefreshToken: [], // List of HTTP codes, -1 for browser
        // failures
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
        // single value means fix interval without interruption
        //queueUpRequests: true, //Queue up the request or replace them with
        // the latest -> invalidated by mode
        clearAfterAllRetriesFailed: false,
        stages: {
          begin: {
            actionType: "SIMPLE_REQUEST_SUCCESS_BEGIN",
            payload: (payload,
                      storeWhenDispatching,
                      operation) => (payload)
          },
          success: {
            actionType: "SIMPLE_REQUEST_SUCCESS_SUCCESS",
            payload: (response,
                      originalActionPayload,
                      storeWhenDispatching,
                      operation) => {}
          },
          failure: {
            actionType: "SIMPLE_REQUEST_SUCCESS_FAILURE",
            payload:  (error,
                       originalActionPayload,
                       storeWhenDispatching,
                       operation) => ({test:"test"} ),
          },
        },

      },
    ],
    credentialManagement: {
      loggedInSelector: (state) => true,
      getAccessToken: (store) => {
        let token = localStorage.getItem('prefer');
        return {prefer: token ? token : "code=401"}

      }, //return tok in obj
      getRefreshToken: (store) => ({Authorization: 1234}), //return tok in obj
      sendsRefreshToken: "header",
      refreshingTokenCallDetails: {
        endpoint: 'Token/REFRESH_URL',
        method: "get",
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
        requestPayload: null,
        requestParameters: {
          headers: {"Content-Type": "application/json"}, //used
          // for logged in
          // Content-Type
          mode: 'cors'
        },
      }, // => make api call //Depending on mode, it sends the token with key
      // -> value
      uponReceivingFreshToken: (body) => {
        localStorage.setItem("prefer", "code=200")
      }, //to store token
    }
  }

  it('Test With Basic Config', () => {

    return expectSaga(sagasFromConfig, config)

      .provide([
        [matchers.call.fn(HttpClient), {response: "awesome", error: null}],
      ])
      .put({type:"SIMPLE_REQUEST_SUCCESS_BEGIN", payload: { id: 42, name: 'Tucker' }})
      .put({type:"QueueManager/ADD_TO_QUEUE/SIMPLE_REQUEST_SUCCESS", operation: config.operations[0], originalActionPayload: { payload: { id: 42, name: 'Tucker' } }, storeWhenDispatching: undefined })
      .put({type:"QueueManager/REMOVE_FROM_QUEUE/SIMPLE_REQUEST_SUCCESS", actionType: 'SIMPLE_REQUEST_SUCCESS' })
      .put({type:"SIMPLE_REQUEST_SUCCESS_SUCCESS"})
      .dispatch({type: 'SIMPLE_REQUEST_SUCCESS', payload: { id: 42, name: 'Tucker' }})

      // Start the test. Returns a Promise.
      .silentRun();
  });


    it('Check Effect with Reducer', () => {


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

      return expectSaga(sagasFromConfig, config)
        .provide([
          [matchers.call.fn(HttpClient), {response: "awesome", error: null}],
        ])
        .withReducer(reducer)

        .hasFinalState({
          name: 'Tucker',
          age: 12, // <-- age changes in store state
        })

        .dispatch({type: 'SIMPLE_REQUEST_SUCCESS', payload: { id: 42, name: 'Tucker' }})
        .silentRun();
    });

});
