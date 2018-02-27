'use strict';

const { fromJS: ImmutableFromJS } = require('immutable');
const yaml = require('js-yaml');
const evaluate = require('./evaluate');
const getProps = require('./props');
const { json, scss } = require('./format');

const namespacedObjectFormats = {
  json: 'tree',
  scss: 'dashed',
};

const convert = async (contents, options = {}) => {
  const { filename, flat, format } = options;
  const data = await evaluate(
    ImmutableFromJS(yaml.safeLoad(contents)).merge(ImmutableFromJS(!filename ? {} : { meta: { filename } }))
  );
  const objectFormat = flat ? 'flat' : namespacedObjectFormats[format] || 'tree';
  const props = getProps(data, { ...options, objectFormat });
  const formatter = { json, scss }[format] || json;
  return formatter(props, options);
};

module.exports = convert;
