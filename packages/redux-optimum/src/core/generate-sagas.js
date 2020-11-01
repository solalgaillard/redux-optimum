//------------------------------------------------------------------------------
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
//
//------------------------------------------------------------------------------

// Move somewhere else
const allSelector = state => state;

// Implement queue_up_requests = false as param
const processOperation = operation => (
  function* (action) {
    const { type, ...payload } = action;

    const storeWhenDispatching = yield select(allSelector);

    const beginPayload = yield call(operation.stages.begin.payload,
      payload,
      storeWhenDispatching,
      operation);

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
    operation.mode === 'every'
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
