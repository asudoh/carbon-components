'use strict';

const fs = require('fs');
const { promisify } = require('bluebird');
const program = require('commander');
const convert = require('./convert');

const readFile = promisify(fs.readFile);

program
  .usage('[options] <filename>')
  .option('-l, --flat', 'Yields flat data format')
  .option('-f, --format [format]', 'Output file format', /^(json|scss)$/i, 'json')
  .parse(process.argv);

const filename = program.args[0];
const { format, flat } = program;

readFile(filename, 'utf8')
  .then(contents => convert(contents, { filename, format, flat }))
  .then(contents => {
    process.stdout.write(contents);
  })
  .catch(err => {
    console.error(err.stack); // eslint-disable-line no-console
  });
