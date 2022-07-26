const path = require('path');
const webpack = require('webpack')
const fs = require('fs');

module.exports = {
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'build/tests'),
    filename: 'tests.js'
  },

  resolve: {
    extensions: [".ts", ".js"]
  },
  target: 'node',
    module: {
    rules: [
      {
        test: /\.json/,
        loader: 'json-loader',
      },
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        enforce: 'post',
        test: /\.ts?$/,
        loader: 'istanbul-instrumenter-loader',
        exclude: [
          'node_modules',
          'seeder',
          /test\.ts$/,
          /\.spec\.ts$/
        ]
      }
    ]
  }
};