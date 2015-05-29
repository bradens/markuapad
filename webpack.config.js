'use strict';
var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonLoaders = [
  {test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/},
  {test: /\.scss?$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass')}
];

module.exports = {
    name: 'browser',
    entry: {
      app: './src/markuapad.js',
      web: './src/web.js',
      index: './src/index.js'
    },
    output: {
      path: "./build",
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
      loaders: commonLoaders
    },
    plugins: [
		  new ExtractTextPlugin('app.css', {
        allChunks: true
      })
		],
    devServer: {
      contentBase: "./build",
      inline: true
    }
  }