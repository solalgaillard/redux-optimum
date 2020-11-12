//-------------------------------------------------------------------------------
// This is the config file that is shared both by the dev and prod config. It
// is merged with each specific config.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

const path = require('path')
const HtmlWebpackPlugin = require('/usr/local/lib/node_modules/html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('/usr/local/lib/node_modules/favicons-webpack-plugin');

//-------------------------------------------------------------------------------
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

module.exports = {
  module: {
    rules: [
      {
        test: /\/animation\.|\.pdf/,
        loader: 'file-loader',
        options: {
          name: (name) => {
            let ext = name.split('.');
            ext = ext[ext.length - 1]
            switch (ext) {
                case 'pdf':
                case 'doc':
                    ext = 'documents';
                    break;
                default:
                    ext = 'animation';
            }
            return `${ext}/[name].[ext]`;
          },
          outputPath: "assets"
        },
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'babel-loader', options: { configFile: path.resolve(__dirname,'../babel.config.js')}  },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
              svgo: {
                plugins: [
                  {"inlineStyles": { "onlyMatchedOnce": false }}
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
            options: {
              fallback: true,
              name: 'js/workers/worker.[hash].js'
            }
          }
      },
      {
        test: /node_modules[/\\]createjs/,
        loaders: [
          'imports-loader?this=>window',
          'exports-loader?window.createjs'
        ]
      }
    ]},
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template:path.resolve(__dirname,'../../src/index-template.html'),
    })
    ],
  resolve: {
    alias: {
      'shared-globals': path.resolve(__dirname, '../../src/shared-globals.scss'),
      utilities: path.resolve(__dirname, '../../src/js/utilities'),
      stateManagement: path.resolve(__dirname, '../../src/js/stateManagement'),
    },
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    alias: {
    }
  },
}
