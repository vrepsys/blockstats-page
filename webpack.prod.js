const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new LodashModuleReplacementPlugin({
      "currying": true,
      "flattening": true,
      "paths": true,
      "placeholders": true,
      "shorthands": true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ]
});
