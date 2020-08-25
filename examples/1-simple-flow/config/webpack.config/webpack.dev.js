//-------------------------------------------------------------------------------
// This is the dev config file. It takes the common config file and merge it
// with its own rules.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//-------------------------------------------------------------------------------
//
// CANT GET TRUE SOURCEMAPS FOR INDENTED SASS AS NODE_SASS ALREADY TRANSPILED BUT
// CANT GET SOURCEMAP EITHER UNTIL 2.2.0 CAUSE OF THE LACK OF PREFIX
//
//
//
// The config uses url-loader to load assets as base64 string as long as
// they are not bigger than 128Kb. It organizes them into the appropriate
// folders depending on their types if they are too big to be uri-encoded.
//
// The svg importer relies on svgo to inline styles from svgs and translate
// them as a raw source to be imported. I forked an old version of
// react-svg-loader to change it so it could use the last version of svgo.
// !!!!!! CHECK IF NEW VERSION allows the use of the latest version
// of svgo to inline style, if not, create a new npm package to consume !!!!!!
// The config file for babel is not at the root level, the config's path
// needs to be specified.
//
// The config also uses imports-loader and exports-loader to shim the createjs
// library as a commonJS module that can be imported. The this reference is
// replaced by the window object and the import directive takes 'createjs' as
// the object that contains the library properties and methods.
//
// The worker-loader allows to import worker files.
//
// The HtmlWebpackPlugin allows to inject all the javascript dependencies for
// the App into a templated Html file.
//
// Resolve allows to alias all the subsequent paths in the commonJS modules.
// It also allows not to specify the js and jsx extensions.
//
// Externals exclude unnecessary dependencies from babylon.js that cause
// console warnings.
//
//-------------------------------------------------------------------------------

module.exports = env => merge(common, {
  mode: 'development',
  entry:  path.resolve(__dirname, `../../src/js/main.js`),
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[hash].js',
    globalObject: 'this'
    //path: path.resolve(__dirname, '../../build'), //Do we need it ?
    //publicPath: '/', // Do we need it ?
  },
  devServer: {
    https: true,
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|jpg|gif|png|woff|woff2|eot|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 12800,
          name: (name) => {
            let ext = name.split('.');
            ext = ext[ext.length - 1]
            switch (ext) {
              case 'jpeg':
              case 'jpg':
              case 'png':
              case 'gif':
                ext = 'images';
                break;
              case 'woff':
              case 'woff2':
              case 'eot':
              case 'ttf':
                ext = 'fonts';
                break;
              default:
                ext = 'miscellaneous'
            }
            return `${ext}/[name].[ext]`;
          },
          //publicPath: "../assets",
          outputPath: "assets"
        },
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
         'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }
        ],
      },
      {
        test: /\.(c|sa|sc)ss$/,
        exclude: /node_modules/,
        use: [
          'css-hot-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/'
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }

        ],
        sideEffects: true,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { configFile: path.resolve(__dirname, '../babel.config.js') }
          },
          /*{
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
              configFile: path.resolve(__dirname, '../eslint.config.js')
            }
          },*/
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
})
