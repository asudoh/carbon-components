/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: ['last 1 version', 'Firefox ESR', 'ie >= 11'],
                  },
                ],
              ],
              // `version: '7.3.0'` ensures `@babel/plugin-transform-runtime` is applied to decorator helper
              // plugins: [['@babel/plugin-transform-runtime', { version: '7.3.0' }]],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        sideEffects: true,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 1 version', 'ie >= 11'],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')],
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  devServer: {
    open: true,
    contentBase: path.resolve(__dirname, 'src'),
    publicPath: '/dist',
  },
};
