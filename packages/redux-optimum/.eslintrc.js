//-------------------------------------------------------------------------------
// Contains the configuration for the linter.
// Semi-colons are necessary. Use the base from AirBnB and a plugin for React
//
//-------------------------------------------------------------------------------

module.exports = {
  env: {
    browser: true,
    'jest/globals': true,
  },
  parser: 'babel-eslint',
  plugins: ['jest'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'max-len': [1, 80, 2, { ignoreComments: true }],
    semi: ['error', 'always'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'func-names': ['warn', 'never'],
    'brace-style': ['error', 'stroustrup'],
    'no-underscore-dangle':  ['error', { 'allow': ['__get__', '__set__'] }],
    'jest/expect-expect': [
      'error',
      {
        'assertFunctionNames': ['expect', 'testSaga', 'expectSaga'],
      },
    ],
    'jest/prefer-expect-assertions': [
      'off',
    ],
  },
  extends: ['airbnb-base', "plugin:jest/all"]
};
