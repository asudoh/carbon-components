'use strict';

const multiEntry = require('rollup-plugin-multi-entry');
const string = require('rollup-plugin-string');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

const objectToStringPolyfillPath = require.resolve('core-js/library/modules/es6.object.to-string.js');

module.exports = cloptions => ({
  input: '\0rollup-plugin-multi-entry:entry-point',
  format: 'iife',
  name: 'CarbonComponentsTest',
  sourcemap: 'inline',
  plugins: [
    multiEntry({
      include: 'tests/spec/**/*.js',
    }),
    {
      // eslint-disable-next-line consistent-return
      load(id) {
        // core-js/library/modules/es6.object.to-string.js is a zero-length file
        if (id === objectToStringPolyfillPath) {
          return 'export default undefined';
        }
      },
    },
    resolve({
      jsnext: true,
      main: true,
    }),
    string({
      include: '**/*.html',
    }),
    commonjs({
      include: ['node_modules/**'],
      namedExports: {
        'node_modules/bluebird/js/release/bluebird.js': ['delay', 'promisify'],
      },
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              browsers: ['last 1 version', 'ie >= 11'],
            },
          },
        ],
      ],
      plugins: [
        'transform-class-properties',
        ['transform-runtime', { polyfill: false }],
      ].concat(cloptions.debug ? [] : [
        [
          'istanbul',
          {
            include: [
              'src/components/**/*.js',
            ],
          },
        ],
      ]),
    }),
  ],
  file: 'build/test.js',
});
