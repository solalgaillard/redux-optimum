import ApiEndpoints from "utilities/apiCallsList"

/*
* 1 - Keep action types in a constant file
* 2 - Keep api constants in a constant file
*
* */

/*
*
* Can flush all Channels by calling QueueManager/FLUSH_CHANNELS
*
* */

/*
*
* if need processedPayload in begin, success or failure
*
* 3rdArg.APICallSettings.payload(1stArg, 2ndArg)
*
* */

const config = {
    //Add default for every operations.
    operations : [
      {
        actionType: "SIMPLE_REQUEST_SUCCESS",
        APICallSettings: {
          endpoint: (originalActionPayload, store) => ApiEndpoints['SIMPLE_REQUEST_200'],
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
    {
      actionType: "SIMPLE_REQUEST_FAILURE",
      APICallSettings: {
        endpoint: (originalActionPayload, store) => ApiEndpoints['SIMPLE_REQUEST_500'],
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
      retriesDelays: [5, 5], //default // empty no retries
      // single value means fix interval without interruption
      //queueUpRequests: true, //Queue up the request or replace them with
      // the latest -> invalidated by mode
      clearAfterAllRetriesFailed: true,
      stages: {
        begin: {
          actionType: "SIMPLE_REQUEST_FAILURE_BEGIN",
          payload: (payload,
                    storeWhenDispatching,
                    operation) => (payload)
        },
        success: {
          actionType: "SIMPLE_REQUEST_FAILURE_SUCCESS",
          payload: (response,
                    originalActionPayload,
                    storeWhenDispatching,
                    operation) => {}
        },
        failure: {
          actionType: "SIMPLE_REQUEST_FAILURE_FAILURE",
          payload:  (error,
                     originalActionPayload,
                     storeWhenDispatching,
                     operation) => ({test:"test"} ),
        },
      },

    },
      {
        actionType: "REQUEST_WITH_EXPIRED_TOKEN_REFRESH",
        APICallSettings: {
          endpoint: (originalActionPayload, store) => "https://redux-optimistic.stoplight.io/mocks/redux-optimistic/redux-optimum/1095867/validate-only-with-proper-token",
          method: 'get',
          requestParameters: {
            headers: {"Content-Type": "application/json"},
            //headers: {"prefer": "code=401"}, //used for
            // logged in// Content-Type
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
        sendsAccessToken: "header", //none, header, query, body
        mode: "every", // or latest, -> just take latest call or queue all calls
        HTTPCodesRefreshToken: [-1, 401], // List of HTTP codes, -1 for browser
        // failures
        HTTPCodeFailures: [],
        retriesDelays: [5, 5], //default // empty no retries
        // single value means fix interval without interruption
        //queueUpRequests: true, //Queue up the request or replace them with
        // the latest -> invalidated by mode
        clearAfterAllRetriesFailed: true,
        stages: {
          begin: {
            actionType: "REQUEST_WITH_EXPIRED_TOKEN_REFRESH_BEGIN",
            payload: (payload,
                      storeWhenDispatching,
                      operation) => (payload)
          },
          success: {
            actionType: "REQUEST_WITH_EXPIRED_TOKEN_REFRESH_SUCCESS",
            payload: (response,
                      originalActionPayload,
                      storeWhenDispatching,
                      operation) => {}
          },
          failure: {
            actionType: "REQUEST_WITH_EXPIRED_TOKEN_REFRESH_FAILURE",
            payload:  (error,
                       originalActionPayload,
                       storeWhenDispatching,
                       operation) => ({test:"test"} ),
          },
        },

      }

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
      endpoint: ApiEndpoints['Token/REFRESH'],
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

export default config;
