/* eslint-disable */
//-------------------------------------------------------------------------------
// Four HOCs so every component can consume wrappers to connect to the store,
// translations, register all loaded instances of ag-grid to force a re-render,
// or bring a component into the dedicated modal box wrapper.
//
// Load Polyfills before rendering the app (promise-based).
//
// Attach React to #simple-flow.
//
// Scoped stylesheet contains global-level basic styles for all tags and for the
// app container that is not displayed on load. Vanilla js takes care of it in sagas --------- XXXXX >>>>>>
// --------- XXXXX >>>>>> HAS TO BE REVIEWED CAUSE I THINK IT SHOULD BE MANAGED BY REACT ---- THE WHOLE PRELOADER
// THINGY HAS TO BE REVIEWED.
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
// React Render Call in a promise with browser sniffing first in order
// to load polyfills if needed. HOC for redux-connect, react-i18next,
// ag-grid, and a modal box.
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
