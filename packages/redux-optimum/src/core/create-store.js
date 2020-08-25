import 'regenerator-runtime/runtime'; // Do I need it ?, delete in dep ?
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import QueueManager from '../queue-manager-reducers/index';
import sagasFromConfig from './generate-sagas';
import watcherOfflineOnlineEvent from '../network-detection';

/* import { persistStore, persistReducer } from 'redux-persist';
   import { PersistGate } from 'redux-persist/integration/react'
   import storage from 'redux-persist/lib/storage';

   const persistConfig = {
     key: 'root',
     storage,
   } */

const reduxDevTools = process.env.NODE_ENV === 'development'
  ? require('redux-devtools-extension/developmentOnly') : null;

const combineReducersOptimistic = args => (
  combineReducers({
    ...args,
    QueueManager,
  })
);

const createStoreOptimistic = (appReducer, config) => {
  function* rootSaga() {
    yield all([
      // authentificationOperations.watchAll(),
      watcherOfflineOnlineEvent(),
      sagasFromConfig(config),
    ]);
  }

  const sagaMiddleware = createSagaMiddleware();

  const rootReducer = (state, action) => {
    let newState = state;
    if (action.type === 'All/RESET') {
      // storage.removeItem('persist:root')
      newState = undefined;
    }
    return appReducer(newState, action);
  };

  const store = createStore(
    rootReducer,
    // rootReducer,//Replace root by persistedReducer
    (process.env.NODE_ENV === 'development'
      ? reduxDevTools.composeWithDevTools(applyMiddleware(sagaMiddleware))
      : applyMiddleware(sagaMiddleware)
    ),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export {
  combineReducersOptimistic,
  createStoreOptimistic,
};
