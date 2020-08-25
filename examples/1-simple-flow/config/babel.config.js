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
  "plugins": [
      ["@babel/plugin-proposal-decorators", {"legacy": true}],
      ["@babel/plugin-proposal-class-properties", { "loose" : true }],
      "@babel/plugin-syntax-dynamic-import",
      "emotion"
  ],
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
