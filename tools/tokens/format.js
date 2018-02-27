'use strict';

const fs = require('fs');
const { resolve } = require('path');
const { promisify } = require('bluebird');
const Handlebars = require('handlebars');
const helpers = require('handlebars-helpers');

const readFile = promisify(fs.readFile);

helpers({ Handlebars });

const getTemplateCache = (() => {
  const caches = {};
  return async name => {
    if (!caches[name]) {
      caches[name] = Handlebars.compile(await readFile(resolve(__dirname, `templates/${name}.hbs`), 'utf8'));
    }
    return caches[name];
  };
})();

const json = props => `${JSON.stringify(props, null, 2)}\n`;

const scss = async props => {
  const template = await getTemplateCache('scss');
  return template(props);
};

module.exports = {
  json,
  scss,
};
