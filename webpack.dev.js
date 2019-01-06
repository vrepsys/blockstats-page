const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{
      from: './data/sample-data.json',
      to: './data/data.json'
    }]),
    new CopyWebpackPlugin([{
      from: './data/apps.top100.csv',
      to: './data/apps.top100.csv'
    }])
  ]
});