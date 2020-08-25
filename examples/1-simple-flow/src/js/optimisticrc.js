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
        actionType: "TEST",
        APICallSettings: {
          endpoint: (originalActionPayload, store) => ApiEndpoints['SIMPLE_REQUEST_200'],
          method: 'get',
          requestParameters: {
            headers: {"Content-Type": "application/json"}, //used for logged in //Content-Type
            credentials: 'include', //cookie credential optional
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
        sendAccessToken: false, //none, header, query, body
        mode: "every", // or latest, -> just take latest call or queue all calls
        HTTPCodesRefreshToken: [-1], // List of HTTP codes, -1 for browser
        // failures
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
        // single value means fix interval without interruption
        //queueUpRequests: true, //Queue up the request or replace them with
        // the latest -> invalidated by mode
        clearAfterAllRetriesFailed: false,
        stages: {
          begin: {
            actionType: "TEST_BEGIN",
            payload: (payload,
                      storeWhenDispatching,
                      operation) => (payload)
          },
          success: {
            actionType: "TEST_SUCCESS",
            payload: (response,
                      originalActionPayload,
                      storeWhenDispatching,
                      operation) => {}
          },
          failure: {
            actionType: "TEST_FAILURE",
            payload:  (error,
                       originalActionPayload,
                       storeWhenDispatching,
                       operation) => ({test:"test"} ),
          },
        },

    },
    {
      actionType: "TEST2",
      APICallSettings: {
        endpoint: (originalActionPayload, store) => ApiEndpoints['SIMPLE_REQUEST_500'],
        method: 'get',
        requestParameters: {
          headers: {"Content-Type": "application/json"}, //used for logged in //Content-Type
          credentials: 'include', //cookie credential optional
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
      sendAccessToken: false, //none, header, query, body
      mode: "every", // or latest, -> just take latest call or queue all calls
      HTTPCodesRefreshToken: [-1], // List of HTTP codes, -1 for browser
      // failures
      HTTPCodeFailures: [],
      retriesDelays: [5, 5], //default // empty no retries
      // single value means fix interval without interruption
      //queueUpRequests: true, //Queue up the request or replace them with
      // the latest -> invalidated by mode
      clearAfterAllRetriesFailed: true,
      stages: {
        begin: {
          actionType: "TEST_BEGIN",
          payload: (payload,
                    storeWhenDispatching,
                    operation) => (payload)
        },
        success: {
          actionType: "TEST_SUCCESS",
          payload: (response,
                    originalActionPayload,
                    storeWhenDispatching,
                    operation) => {}
        },
        failure: {
          actionType: "TEST_FAILURE",
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
    getAccessToken: (store) => {}, //return tok in obj
    getRefreshToken: (store) => ({refreshTok: 1234}), //return tok in obj
    refreshingTokenCallDetails: (token) => ({
      endpoint: ApiEndpoints['Token/REFRESH'],
      method: "post",
      HTTPCodeFailures: [],
      retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
      //requestPayload: JSON.stringify({send_tok: token}),
      requestParameters: {
        headers: {"Content-Type": "application/json"}, //used for logged in //Content-Type
        mode: 'cors'
      },
    }), // => make api call //Depending on mode, it sends the token with key
    // -> value
    uponReceivingFreshToken: () => {}, //to store token
  }
}

export default config;
