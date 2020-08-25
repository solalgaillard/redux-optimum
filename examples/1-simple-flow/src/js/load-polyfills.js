/* eslint-disable */
//-------------------------------------------------------------------------------
// Load all the polyfills necessary to make the App work with older browser.
// (IE9>+). Load all the new methods from ES6 with core-js. Load new fetch
// API with whatwg-fetch. !!!!!!!BRING INTL POLYFILL IN.!!!!!!!!!!
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives - Use core-js as a polyfill to ensure promises can be
// fulfilled.
//-------------------------------------------------------------------------------

import 'core-js/es/promise';

//-------------------------------------------------------------------------------
// React Render Call
//-------------------------------------------------------------------------------

const loadPolyfills = () => {
  const fillFetch = () => {
    new Promise((resolve) => {
      if ('fetch' in window) return resolve();

      require.ensure([], () => {
        require('whatwg-fetch');

        resolve();
      }, 'fetch');
    });
  };

  const fillCoreJs = () => {
    new Promise((resolve) => {
      if (
        'startsWith' in String.prototype
        && 'endsWith' in String.prototype
        && 'includes' in Array.prototype
        && 'assign' in Object
        && 'keys' in Object
      ) return resolve();

      require.ensure([], () => {
        require('core-js');

        resolve();
      }, 'core-js');
    });
  };

  return Promise.all([
    fillFetch(),
    fillCoreJs(),
  ]);
};

export default loadPolyfills;
