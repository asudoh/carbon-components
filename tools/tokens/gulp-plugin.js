'use strict';

const { parse, resolve } = require('path');
const through = require('through2');
const convert = require('./convert');

const plugin = options =>
  through.obj((file, enc, done) => {
    convert(file.contents.toString('utf8'), { ...options, filename: file.path }).then(
      converted => {
        const { dir, name } = parse(file.path);
        file.path = resolve(dir, `${name}.${options.format}`);
        file.contents = Buffer(converted);
        done(null, file);
      },
      err => {
        done(err);
      }
    );
  });

module.exports = plugin;
