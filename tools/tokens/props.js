'use strict';

const { OrderedMap } = require('immutable');

const getPathComps = path => (path != null && (Array.isArray(path) ? path : String(path).split('.'))) || [];

/**
 * @param {Object} o An object.
 * @param {string} path The path from object, either dot-concatenated string or an array.
 * @returns The value of the object path.
 */
const getObjectPath = (o, path) => getPathComps(path).reduce((ref, comp) => (comp == null ? ref : ref[comp]), o);

/**
 * Sets a value to an object path.
 * @param {Object} o An object.
 * @param {string} path The path from object, either dot-concatenated string or an array.
 */
const setObjectPath = (o, path, value) => {
  const comps = getPathComps(path).slice();
  const prop = comps.pop();
  // Try ensureing the object to set the property to
  comps.reduce((ref, comp) => {
    if (ref) {
      if (typeof ref[comp] === 'undefined') {
        ref[comp] = {};
      }
      return ref[comp];
    }
    return undefined;
  }, o);
  const ref = comps.length > 0 ? getObjectPath(o, comps) : o;
  if (Object(ref) === ref && path) {
    ref[prop] = value;
  }
};

const getObjectTree = props =>
  props.reduce((o, v, k) => {
    setObjectPath(
      o,
      k
        .split(':')
        .reverse()
        .join('.'),
      v
    );
    return o;
  }, {});

const getObjectDashed = props =>
  props.reduce((o, v, k) => {
    const prop = k
      .split(':')
      .reverse()
      .join('-');
    return {
      ...o,
      [prop]: v,
    };
  }, {});

const getObjectFlat = props =>
  props.reduce(
    (o, v, k) => ({
      ...o,
      [k.split(':')[0]]: v,
    }),
    {}
  );

const objectFormatters = {
  tree: getObjectTree,
  dashed: getObjectDashed,
  flat: getObjectFlat,
};

const getProps = (data, options) => {
  const props = data.get('props', OrderedMap());
  const objectFormat = options.objectFormat || 'tree';
  const objectFormatter = objectFormatters[objectFormat];
  if (!objectFormatter) {
    throw new TypeError(`Object formatter for ${objectFormat} format is not found.`);
  }
  return objectFormatter(props);
};

module.exports = getProps;
