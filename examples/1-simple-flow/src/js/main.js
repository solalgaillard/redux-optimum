//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom';
import loadPolyfills from './load-polyfills';

import { PersistGate } from 'redux-persist/integration/react'

import { I18nextProvider } from 'react-i18next';

import { Provider } from 'react-redux';
import {store, persistor} from './redux-store/createStore';


import SimpleFlow from './components/SimpleFlow';

/* eslint no-unused-vars: "off" */
import styles from './main.scss';
/* eslint no-unused-vars: "off" */

//-------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------

//console.log(store, persistor)

loadPolyfills().then(() => {
  ReactDOM.render(
        <Provider store={store}>
          {/*<PersistGate loading={null} persistor={persistor}>*/}
              <SimpleFlow/>
          {/*</PersistGate>*/}
        </Provider>,
      document.getElementById('simple-flow'),
  );
});
