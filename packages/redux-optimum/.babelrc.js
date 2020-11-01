//-------------------------------------------------------------------------------
// Contains the configuration for the babel transpiling syntax.
// Order matters as class properties need to be after the decorators with the
// loose setting so not to conflict.
//
// The use of decorators, class properties, dynamic imports as well as ES6
// syntax are allowed.
//
//-------------------------------------------------------------------------------

module.exports = {
  "presets": [
    "@babel/preset-env",
  ],
  "plugins": ["@babel/plugin-transform-runtime", "rewire", "@babel/plugin-proposal-class-properties"//because of httpclient to remove eventually
  ]
}
