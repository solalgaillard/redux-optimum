<img src='./logo/redux-optimum.svg' alt='Redux Optimistic Landscape' width='800px'>

## Redux-optimum

`Redux-optimum` is a library which aims is to make UI optimistic data fetching incredibly easy. Give it some endpoints \(and all the settings they need\) and it will provide you with the _redux actions_ you might want for each stage during the process of calling an API. Furthermore, `redux-optimum` provides you with an API queue manager. You can state wether or not you want to retry a call, how many times and when, or if you simply want to revert the data upon failure and abandon it. The library also allows you to centralize in one place all the definitions of these API calls and then worry about implementing the reducers any way you normally would. The queue manager has its own key in the store and provides you with all the info you might need so you can see what requests are being processed, if there are any errors, as well as any countdown till the next retry. Thus, allowing you to provide helpful feedback to your users.

The library offers a credential management system where you can, upon an API call failure, decide to refresh a token \(using any HTTP code you might wish\). You can also queue up all calls to certain endpoints until the user logs in.

This library is built on top of the `redux-saga` redux middleware. This kind of complex data flow management couldn't be done without it. It takes the whole idea behind most common uses of any `redux` middleware such as `redux-saga` or `redux-thunk` and aims at providing an opinionated and out-of-the-box solution for an easy and centralized API call management system without locking you in when you have edge-cases.

## Getting started

### Install

```sh
$ npm install redux-optimum
```

or

### Usage Example

You want to call an endpoint and have your global store be notified the call has started, or has been placed into a queue \(one queue per action type\) and is waiting to be processed? You want the call to notify the store that it has been processed successfully or is still in the queue because it has failed? You want to decide for which HTTP codes, we deem the call to be a true failure, for which we place them back in the queue to retry them, or for which, we try to refresh the credentials?

Wouldn't that be great to have all that with minimum configuration? Well, you can. Centralize all your definitions in one config file.

```js
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

    }

   ],
  credentialManagement: {
      loggedInSelector: (state) => true,
      getAccessToken: (store) => {}, //return tok in obj
      getRefreshToken: (store) => ({Authorization: 1234}), //return tok in obj
      refreshingTokenCallDetails: (refreshToken) => ({
        endpoint: ApiEndpoints['Token/REFRESH'],
        method: "get",
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
        //requestPayload: JSON.stringify({send_tok: token}),
        requestParameters: {
          headers: {"Content-Type": "application/json", ...refreshToken}, //used
          // for logged in
          // Content-Type
          mode: 'cors'
        },
      }), // => make api call //Depending on mode, it sends the token with key
      // -> value
      uponReceivingFreshToken: (body) => {}, //to store token
    }
}
```

First, we will try to understand the generic settings for any operation. These are limited and concern only the credential Management:

**config.js**

```js
credentialManagement: {
    loggedInSelector: (state) => true,
    providingAccessToken: (store) => {}, //Return obj, key value
    sendingRefreshToken: (store) => {}, // => make api call
    uponReceivingFreshToken: () => {}, //to store token
  }
```

```js
loggedInSelector: (state) => aBoolean
```

The loggedInSelector method allows for a selector to be given to the queue manager. The queue manager expects the method to return a boolean and it defaults to true if not defined. The whole store is passed to it so you can extract this information easily if you already have it in the store. The idea behind it is to let you decide how you consider a user logged in and to give the queue manager this information.

```js
getAccessToken: (store) => {propertyName: aString}, //Return obj, key value
```

getAccessToken makes you responsible for returning the access token in a dictionary form. It can be grabbed from the store, or from a global storage place \(local storage or cookie\). It expects the token to be a string and will use the property name, however it is used in the operation, whether within a header, a json, or a query parameter.

```js
sendingRefreshToken: (store) => ({refreshTok: 1234}) //make api call
```

sendingRefreshToken behaves exactly the same way as getAccessToken. The only difference is that it will be processed not at the operation level but in the refreshingTokenCallDetails.

```js
refreshingTokenCallDetails: () => ({
                                        endpoint: ApiEndpoints['Token/REFRESH'],
                                        method: "post",
                                        HTTPCodeFailures: [],
                                        retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
                                        //requestPayload: JSON.stringify({send_tok: token}),
                                        requestParameters: {
                                          headers: {"Content-Type": "application/json"}, //used for logged in //Content-Type
                                          mode: 'cors'
                                        },
                                      }) //Return obj, key value
```

uponReceivingToken.

```js
uponReceivingToken: () => {}, //Return obj, key value
```

uponReceivingToken.

```js
operations : [
      {
        actionType: "TEST",
        APICallSettings: {
          endpoint: (originalActionPayload, store) => ApiEndpoints['Company/TEST'],
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
        mode: "every", // or latest,
        refreshToken: [], // List of codes
        HTTPCodeFailures: [],
        retriesDelays: [10, 30, 60, 180, 300], //default // empty no retries
        queueUpRequests: true, //Queue up the request or replace them with
        // the latest
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
                       operation) => ({...company, error: [...company.error, {[endpoint]: error}]} ),
          },
        },

    }

 ],
```

Here you define all the parameters for each operation.

actionType: string, required Name of the first action to be dispatched to trigger the API Call

APICallSettings: object Contain all the settings required to complete the appropriate API call.

**createStore.js**

```js
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
```

## Documentation

- [Full Doc is available here](https://solalgaillard.gitbook.io/redux-optimum/)

## Translation

* [French](https://#) Soon to come

```sh
# Building examples from sources

$ git clone https://github.com/solalgaillard/redux-optimistic.git
$ cd redux-optimum

```

Below are the examples ported \(so far\) from the Redux repos.

#### Simple Flow

Under Construction

```sh
$ npm run simple-flow

# run unit test for simple-flow
$ npm run test-simple-flow
```

**Complex Flow**

Soon to come

**With Persistence**

Soon to come

### License

Copyright \(c\) 2020 Solal Gaillard.

Licensed under The MIT License \(MIT\).

