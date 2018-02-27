'use strict';

const convert = require('./convert');
const plugin = require('./gulp-plugin');

module.exports = Object.assign(convert, { plugin });
