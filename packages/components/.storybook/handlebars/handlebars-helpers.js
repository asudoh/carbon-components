'use strict';

// `handlebars-helpers` not depending on node.js
module.exports = {
  array: require('handlebars-helpers/lib/array'),
  collection: require('handlebars-helpers/lib/collection'),
  comparison: require('handlebars-helpers/lib/comparison'),
  date: require('handlebars-helpers/lib/date'),
  i18n: require('handlebars-helpers/lib/i18n'),
  inflection: require('handlebars-helpers/lib/inflection'),
  match: require('handlebars-helpers/lib/match'),
  math: require('handlebars-helpers/lib/math'),
  misc: require('handlebars-helpers/lib/misc'),
  number: require('handlebars-helpers/lib/number'),
  object: require('handlebars-helpers/lib/object'),
  regex: require('handlebars-helpers/lib/regex'),
  string: require('handlebars-helpers/lib/string'),
  url: require('handlebars-helpers/lib/url'),
};
