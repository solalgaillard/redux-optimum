//-------------------------------------------------------------------------------
// Contains the configuration for the linter.
// Semi-colons are necessary. Use the base from AirBnB and a plugin for React
// Use the aliases found in webpack.common.js to resolve the import paths.
// Use the legacy decorator syntax.
//
//-------------------------------------------------------------------------------

module.exports = {
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'max-len': [1, 80, 2, { ignoreComments: true }],
    semi: ['error', 'always'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'func-names': ['warn', 'never'],
    'brace-style': ['error', 'stroustrup'],
  },
  extends: ['airbnb-base']
};
