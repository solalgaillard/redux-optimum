//------------------------------------------------------------------------------
//  Unit Testing of the generate-sagas generator functions
//------------------------------------------------------------------------------

import {
  call, fork, takeLatest,
} from 'redux-saga/effects';
import { testSaga } from 'redux-saga-test-plan';
/* eslint-disable import/named */
import sagasFromConfig,
{ __RewireAPI__ as generateSagas } from './generate-sagas';
/* eslint-enable import/named */
import processQueue from './process-queues';

//------------------------------------------------------------------------------
//  Mocking Functions
//------------------------------------------------------------------------------

jest.mock('./process-queues', () => {
  function* returnedGenerator() {
    yield '';
  }
  const returnGenerator = () => returnedGenerator;

  return {
    __esModule: true, // Necessary for ES Modules
    default: returnGenerator,
  };
});

const createSaga = generateSagas.__get__('createSaga');

const processOperation = generateSagas.__get__('processOperation');

generateSagas.__set__('processOperation', () => '');

const processOperationMocked = generateSagas.__get__('processOperation');

//------------------------------------------------------------------------------
//  Tests
//------------------------------------------------------------------------------

describe('sagasFromConfig Unit Testing', () => {
  it(
    'sagasFromConfig with 0 operations and empty credentialManagement',
    () => {
      const config = {
        operations: [],
        credentialManagement: {},
      };
      testSaga(sagasFromConfig, config)
        .next()
        .all(
          config.operations.map(operation => (
            call(createSaga, operation, config.credentialManagement)
          )),
        )
        .next()
        .isDone();
    },
  );

  it(
    `sagasFromConfig with 1 empty operation
    'and empty credentialManagement`,
    () => {
      const config = {
        operations: [{}],
        credentialManagement: {},
      };
      testSaga(sagasFromConfig, config)
        .next()
        .all(
          config.operations.map(operation => (
            call(createSaga, operation, config.credentialManagement)
          )),
        )
        .next()
        .isDone();
    },
  );
});

describe('createSaga Unit Testing', () => {
  it('createSaga', () => {
    const operation = { actionType: 'TEST', queueUpRequests: true };
    const credentialManagement = {};

    const saga = processOperationMocked();

    testSaga(createSaga, operation, credentialManagement)
      .next()
      .all([
        takeLatest(operation.actionType, saga),
        fork(processQueue(
          `QueueManager/ADD_TO_QUEUE/${operation.actionType}`,
          operation.queueUpRequests,
          credentialManagement,
        )),
      ])
      .next()
      .isDone();
  });
});

describe('processOperation Unit Testing', () => {
  it('processOperation', () => {
    const beginPayload = () => {};

    const operation = {
      actionType: 'TEST',
      queueUpRequests: true,
      stages: {
        begin: { payload: beginPayload, actionType: 'STUFF' },
      },
    };

    const action = { type: 'TEST', other: {} };

    const saga = processOperation(operation);

    testSaga(saga, action)
      .next()
      .select(generateSagas.__get__('allSelector'))
      .next()
      .call(
        operation.stages.begin.payload,
        { other: {} },
        undefined,
        operation,
      )
      .next()
      .put({ type: operation.stages.begin.actionType })
      .next()
      .put({
        type: `QueueManager/ADD_TO_QUEUE/${operation.actionType}`,
        operation,
        originalActionPayload: { other: {} },
        storeWhenDispatching: undefined,
      })
      .next()
      .isDone();
  });
});
