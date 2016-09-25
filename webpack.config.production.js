const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractStyl = new ExtractTextPlugin('[name].css');

const config = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: path.join(__dirname, 'src'),
        exclude: path.join(__dirname, 'src/libs')
      }
    ],
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractStyl.extract(['css', 'stylus'])
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        loader: 'file',
        query: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.woff/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]',
          mimetype: 'application/font-woff'
        }
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  plugins: [
    ExtractStyl,
    new HtmlWebpackPlugin({
      title: 'PixelEdit',
      template: 'src/index.html',
      inject: 'body'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        worker: {
          output: {
            filename: "generateGif.worker.js",
            chunkFilename: "[id].generateGif.worker.js"
          }
        }
      }
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify('production'),
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ]
};

module.exports = config;
