const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [
    '@babel/polyfill',
    './src/polyfills/index.js',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'stylus-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[name].[ext]',
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              filename: "generateGif.worker.js",
              chunkFilename: "[id].generateGif.worker.js"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise/auto'
    }),
    new HtmlWebpackPlugin({
      title: 'PixelEdit',
      template: 'src/index.html',
      inject: 'body'
    }),
  ]
};

module.exports = config;
