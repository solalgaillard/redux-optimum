//-------------------------------------------------------------------------------
// This Transformer allows the use of a babel config file that is not at the
// root of the project folder to be used with Jest (See config in package.json).
// The current babel config is shared amongst docz, jest, and webpack.
//
//-------------------------------------------------------------------------------

const babelJest = require('babel-jest');
const babelConfig = require('./babel.config.js');

module.exports = babelJest.createTransformer(babelConfig);
