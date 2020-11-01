//------------------------------------------------------------------------------
//  Unit Testing of the generate-sagas generator functions
//------------------------------------------------------------------------------

import {
  call, fork, takeLatest,
} from 'redux-saga/effects';
import { testSaga } from 'redux-saga-test-plan';
import sagasFromConfig,
{ __RewireAPI__ as generateSagas } from "./generate-sagas";
import processQueue from "./process-queues";

jest.mock('./process-queues', () => {
  function * test () { return 'mockedDefaultExport'}
  const other = () => { return test }
  return {
    __esModule: true, // this property makes it work
    default: other,
  }});

const createSaga = generateSagas.__get__("createSaga");

const processOperation = generateSagas.__get__("processOperation");

generateSagas.__set__('processOperation', function() {
  return "return Promise.resolve('Mock API Response');"
});

const processOperationMocked = generateSagas.__get__("processOperation");


describe('sagasFromConfig Unit Testing', () => {

  it('sagasFromConfig with 0 operations and empty credentialManagement', () => {

    const config = {
      operations : [],
      credentialManagement: {}
    }
    testSaga(sagasFromConfig, config)
      .next()
      .all(
        config.operations.map(operation => (
          call(createSaga, operation, config.credentialManagement)
        )))
      .next()
      .isDone();
  });



  it('sagasFromConfig with 1 empty operation and empty credentialManagement', () => {
    const config = {
      operations : [{}],
      credentialManagement: {}
    }
    testSaga(sagasFromConfig, config)
      .next()
      .all(
        config.operations.map(operation => (
          call(createSaga, operation, config.credentialManagement)
        )))
      .next()
      .isDone();
  });

});


//Problems mocking processOperation
describe('createSaga Unit Testing', () => {
  it('createSaga', () => {

    const operation = {actionType: "TEST", queueUpRequests: true};
    const credentialManagement = {};

    const saga = processOperationMocked()

    testSaga(createSaga, operation, credentialManagement)
      .next()
      .all([
        takeLatest(operation.actionType, saga),
        fork(processQueue(
          `QueueManager/ADD_TO_QUEUE/${operation.actionType}`,
          operation.queueUpRequests,
          credentialManagement,
      ))]
    )
      .next()
      .isDone();
  });

});

describe('processOperation Unit Testing', () => {

  it('processOperation', () => {

    const beginPayload = () => {}

    const operation = {actionType: "TEST", queueUpRequests: true, stages:{begin:{payload:beginPayload, actionType: "STUFF"}}};

    const action = {type: "TEST", other:{}}

    const saga = processOperation(operation)

    testSaga(saga, action)
      .next()
      .select(generateSagas.__get__("allSelector"))
      .next()
      .call(operation.stages.begin.payload,
        {other:{}},
        undefined,
      operation,
    )
      .next()
      .put({type: operation.stages.begin.actionType})
      .next()
      .put({
        type: `QueueManager/ADD_TO_QUEUE/${operation.actionType}`,
        operation,
        originalActionPayload: {other:{}},
        storeWhenDispatching: undefined
      })
      .next()
      .isDone();
  });

});
