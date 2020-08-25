//------------------------------------------------------------------------------
// Four HOCs so every component can consume wrappers to connect to the store,
// translations, register all loaded instances of ag-grid to force a re-render,
// or bring a component into the dedicated modal box wrapper.
//
// Load Polyfills before rendering the app (promise-based).
//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import Directives
//------------------------------------------------------------------------------

import {
  all, call, fork, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';
import processQueue from './process-queues';

//------------------------------------------------------------------------------
// React Render Call in a promise with browser sniffing first in order
// to load polyfills if needed. HOC for redux-connect, react-i18next,
// ag-grid, and a modal box.
//
//------------------------------------------------------------------------------

// Implement queue_up_requests = false as param
const processOperation = operation => (
  function* (action) {
    const { type, ...payload } = action;

    const storeWhenDispatching = yield select(state => state);

    const beginPayload = yield operation.stages.begin.payload(
      payload,
      storeWhenDispatching,
      operation,
    );

    yield put({
      type: operation.stages.begin.actionType,
      ...beginPayload,
    });

    yield put({
      type: `QueueManager/ADD_TO_QUEUE/${operation.actionType}`,
      operation,
      originalActionPayload: payload,
      storeWhenDispatching,
    });
  }
);

function* createSaga(operation, credentialManagement) {
  const saga = processOperation(operation);
  yield all([
    yield operation.mode === 'every'
      ? takeEvery(operation.actionType, saga)
      : takeLatest(operation.actionType, saga),

    fork(processQueue(
      `QueueManager/ADD_TO_QUEUE/${operation.actionType}`,
      operation.queueUpRequests,
      credentialManagement,
    )),
  ]);
}

function* sagasFromConfig(config) {
  yield all(
    config.operations.map(operation => (
      call(createSaga, operation, config.credentialManagement)
    )),
  );
}

export default sagasFromConfig;
