//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import Directives
//------------------------------------------------------------------------------

import { buffers } from 'redux-saga';
import {
  fork,
  put,
  select,
  join,
  actionChannel,
  take,
  call,
  race,
  flush,
  delay,
  cancel,
} from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import HttpClient from '../http-client';

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------

function* callAPI(payload, credentialManagement, initialUUID) {
  const {
    operation,
    originalActionPayload,
    storeWhenDispatching,
  } = payload;

  const {
    APICallSettings,
    HTTPCodesRefreshToken,
    HTTPCodeFailures,
    clearAfterAllRetriesFailed,
  } = operation;

  const { retriesDelays } = operation;
  const requestPayload = APICallSettings.payload(
    originalActionPayload,
    storeWhenDispatching,
  );

  const timeDelay = retriesDelays;
  let i = 0;

  while (i < timeDelay.length) {
    const isSameUUID = yield select(
      state => !state.QueueManager.error.uuid
        || (state.QueueManager.error.uuid === initialUUID),
    );

    try {
      let result = { response: null, error: null };
      result = yield call(
        HttpClient,
        APICallSettings.endpoint(),
        APICallSettings.method,
        requestPayload,
        APICallSettings.requestParameters,
      );

      const { response } = result;

      if (response) {
        if (isSameUUID) {
          yield put({
            type: 'QueueManager/REMOVE_ERROR_MESSAGE',
            message: null,
            retryDelay: null,
            uuid: null,
          });
        }
        return result;
      }

      throw result;
    }
    catch (result) {
      /*
      EXPECT A PROPERLY FORMATTED OBJECT BUT IF THE FETCH API FAILS
       ITSELF, IT WONT DELIVER>>> SAME THING FOR THE REFRESH TOKEN. THIS
        WILL NEED TO BE ADRESSED AT SOME POINT.
       */
      const { error } = result;

      if (HTTPCodeFailures.includes(error.status)) {
        return result;
      }

      if (HTTPCodesRefreshToken.includes(error.status)) {
        // const resultRefreshToken = asy authentificationOperations;
        const refreshToken = yield select(
          state => credentialManagement.providingRefreshToken(state),
        );

        if (refreshToken) {
          let resultRefreshToken = { response: null, error: null };
          resultRefreshToken = yield call(
            HttpClient,
            ...Object.values(
              credentialManagement.sendingRefreshToken(refreshToken),
            ),
          );
        }
      }

       if (
        (Object.prototype.hasOwnProperty.call(error, 'status')
          && error.status === '401')
        || error === 'No Token') {

         /*
         *  Token refresh ici
         *
         * */

          // const resultRefreshToken = yield call(ApiCallsMethods.getAll, ApiCall['Authentification/REFRESH_TOKEN'], true, myHeaders);

        if (resultRefreshToken.response) {
          continue;
        }
        else if (
          Object.prototype.hasOwnProperty.call(
            resultRefreshToken.error,
            'status'
          )
          && resultRefreshToken.error.status === '401') {
          yield put(authentificationActions.logOut());
        }
        i += 1;
        break; // NEED TO NORMALIZE THE CALL
      }
      else if (error.hasOwnProperty('status') && error.status === '400') {
        return result;
      }

      let j = timeDelay[i];
      while (j > 0) {
        if (isSameUUID) {
          yield put({
            type: 'QueueManager/ADD_ERROR_MESSAGE',
            message: 'Oops, we are encountering some difficulties '
              + 'communicating with the server',
            retryDelay: j,
            uuid: initialUUID,
          });
        }
        yield delay(1000);
        j -= 1;
      }

      if (isSameUUID) {
        yield put({
          type: 'QueueManager/ADD_ERROR_MESSAGE',
          message: 'Retrying previous call',
          retryDelay: null,
          uuid: initialUUID,
        });
      }

      if (isSameUUID && i === timeDelay.length - 1) {
        if (clearAfterAllRetriesFailed && isSameUUID) {
          yield put({
            type: 'QueueManager/REMOVE_ERROR_MESSAGE',
            message: null,
            retryDelay: null,
            uuid: null,
          });

          return result;
        }
        yield put({
          type: 'QueueManager/ADD_ERROR_MESSAGE',
          message: 'This'
            + ' seems pretty serious, try again later',
          retryDelay: 0,
          uuid: initialUUID,
        });
      }

      i += 1;
    }
  }
  return false; // no-return policy eslint
}


//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
function* queueProcessor(payload, credentialManagement) {
  const initialUUID = uuidv4();

  let hasBeenCancelledOnce = false;
  let wentThroughACycle = false;

  while (true) {
    // const isLoggedIn = yield select(credentialManagement.logged_in_selector);

    /*
    if (!isLoggedIn) {
      // yield take(authentificationTypes.LOG_IN)
    }
    */

    // Block as well if not logged in
    if (navigator.onLine === false) {
      yield put({
        type: 'QueueManager/GENERAL_MESSAGE',
        message: 'offline',
      });
      yield take('Event/ONLINE');
    }

    if (wentThroughACycle) {
      yield take('All/RetryApiCalls');
    }

    console.log(initialUUID)

    // If not start api call
    const apiCall = yield fork(
      callAPI, payload, credentialManagement, initialUUID,
    );
    if (hasBeenCancelledOnce || wentThroughACycle) {
      const isSameUUID = yield select(
        state => !state.APIManagement.error.uuid
          || (state.APIManagement.error.uuid === initialUUID),
      );
      if (isSameUUID) {
        yield put({
          type: 'QueueManager/ADD_ERROR_MESSAGE',
          message: 'Retrying'
            + ' previous call',
          retryDelay: null,
          uuid: initialUUID,
        });
      }
    }

    // Check if retry or offline got triggered during api call
    const { retryClicked, finishedApiCall, offlineEvent } = yield race({
      retryClicked: take('All/RetryApiCalls'),
      offlineEvent: take('Event/OFFLINE'),
      finishedApiCall: join(apiCall),
    });

    if (offlineEvent || retryClicked) {
      yield cancel(apiCall);
      hasBeenCancelledOnce = true;
    }
    else if (finishedApiCall) {

      console.log("DOES IT GO HERE")

      return finishedApiCall;
    }
    else {
      wentThroughACycle = true;
    }
  }
}

//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------

const processQueue = (
  queueName,
  multipleCallsBuffered = false,
  credentialManagement,
) => (
  function* () {
    const buffer = (multipleCallsBuffered)
      ? buffers.expanding(5)
      : buffers.sliding(1);
    const requestChan = yield actionChannel(queueName, buffer);
    while (true) {
      const action = yield take(requestChan, buffer);
      const { type, ...payload } = action;
      const {
        operation,
        originalActionPayload,
        storeWhenDispatching,
      } = payload;

      const { callApi, cancelling } = yield race({
        callApi: call(queueProcessor, payload, credentialManagement),
        cancelling: take('QueueManager/FLUSH_ALL_CHANNELS'),
      });

      if (callApi) {
        const { response, error } = callApi;

        const { actionType } = operation;

        yield put({
          type: `QueueManager/REMOVE_FROM_QUEUE/${actionType}`,
          actionType,
        });

        console.log("response", response, error)

        if (response) {
          const successPayload = yield operation.stages.success.payload(
            response,
            originalActionPayload,
            storeWhenDispatching,
            operation,
          );
          yield put({
            type: operation.stages.success.actionType,
            ...successPayload,
          });
        }
        else {
          const yieldingFailure = yield operation.stages.failure.payload(
            error,
            originalActionPayload,
            storeWhenDispatching,
            operation,
          );
          yield put({
            type: operation.stages.failure.actionType,
            ...yieldingFailure,
          });
        }

      }
      else if (cancelling) {
        const yieldingFailure = yield operation.stages.failure.payload(
          { status: -1, message: 'cancelled by user' },
          originalActionPayload,
          storeWhenDispatching,
          operation,
        );
        yield put({
          type: operation.stages.failure.actionType,
          ...yieldingFailure,
        });
        yield flush(requestChan);
      }
    }
  }
);

export default processQueue;
