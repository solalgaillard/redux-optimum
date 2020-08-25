//-------------------------------------------------------------------------------
// This is the dev config file. It takes the common config file to merge it
// with its own rules.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require("webpack")
const CompressionPlugin = require('compression-webpack-plugin')
const UnCSSPlugin = require('uncss-webpack-plugin');
const className = require('../../src/site/assets/js/utilities/generateClassname.js')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

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

module.exports = env => merge(common, {
  mode: 'production',
  entry:  path.resolve(__dirname, `../../src/site/js/main.js`),
  output: {
    path: path.resolve(__dirname, `../../build/site/uncompressed`),
    filename: 'js/[name].[contenthash:8].js',
  },
      module: {
        rules: [
          {
          test: /\.html$/,
          use: [
            {
            loader: 'html-loader',
            options: {
              minimize: true
            }
            }
          ],
        },
          {
            test: /\.(jpeg|jpg|gif|png|woff|woff2|eot|ttf)$/,
            use: [
              {loader: 'url-loader',
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
              'image-webpack-loader'
            ]
          },
          {
            test: /\.css$/,
            include: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,

                }
              },
              { loader: 'postcss-loader', options: { config: {path: path.resolve(__dirname,'./config/postcss.config.js')}} },

            ],
            sideEffects: true,
          },
          {
            test: /\.(c|sa|sc)ss$/,
            exclude: /node_modules/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: (resourcePath, context) => {

                    // publicPath is the relative path of the resource to the context
                    // e.g. for ./css/admin/main.css the publicPath will be ../../
                    // while for ./css/main.css the publicPath will be ../
                    return path.relative(path.dirname(resourcePath), context) + '/';
                  }
                }
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                  modules: {
                    getLocalIdent: (context, localIdentName, localName) => {
                      return className.generateScopedName(localName, context.resourcePath);
                    }
                  }
                }
              },
              { loader: 'postcss-loader', options: { config: {path: path.resolve(__dirname,'./config/postcss.config.js')}} },
              'sass-loader' // compiles Sass to CSS

            ],
            sideEffects: true,
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
              { loader: 'babel-loader', options: { configFile: path.resolve(__dirname,'../babel.config.js')}  },
            ],
          },
        ],
      },
        optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                    terserOptions: {
                        warnings: false,
                        output: {
                            comments: false
                        },
                        compress: {
                          //passes: 2,
                            unused: true,
                            dead_code: true, // big one--strip code that will never execute
                            drop_debugger: true,
                            conditionals: true,
                            evaluate: true,
                            drop_console: true, // strips console statements
                            sequences: true,
                            booleans: true,
                        }
                    }
                }),
            ],
            usedExports: true,
            mangleWasmImports: true,
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
               styles: {
                 minSize: 0, //Ignore minSize for CSS files, to force them
                 // in new chunks
                 test: /\.(c|sa|sc)ss$/,
                 reuseExistingChunk: true,
                 enforce: true,
               },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                minSize: 7000,
                enforce: true,
                name(module) {
                  // get the name. E.g. node_modules/packageName/not/this/part.js
                  // or node_modules/packageName
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                  // npm package names are URL-safe, but some servers don't like @ symbols
                  return `vendors/${packageName.replace('@', '')}`;
                },
              },
            },
          },
            },
        plugins: [
            new CleanWebpackPlugin({
              cleanOnceBeforeBuildPatterns: [
                path.resolve(__dirname, `../../build/site/`),
              ],}),
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
              ignoreOrder: true,
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "css/[name].[contenthash:8].css",
    chunkFilename: "css/[name].[contenthash:8].css"
  }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new UnCSSPlugin(),
            new CompressionPlugin({
              minRatio: 1,
              filename: '../compressed/[path]',
              test: /\.(html|css|js|jpeg|jpg|png|pdf|woff|eot|ttf)$/,
            }),
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../../../src/documentation/bundleSizeReporting/bundle-reports.html'
          }) //Don't want to
          // block the io of
          // jenkins, process needs to close
        ],
    })
