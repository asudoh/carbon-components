'use strict';

const Handlebars = require('handlebars/runtime');
const helpers = require('./handlebars-helpers');

Object.keys(helpers).forEach(key => {
  Handlebars.registerHelper(helpers[key]);
});

require('@carbon/icons-handlebars')({ handlebars: Handlebars });

module.exports = Handlebars;
