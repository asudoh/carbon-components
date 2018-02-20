'use strict';

/**
 * @param {string} name The original name.
 * @param {Function|Object|string} [nameMap]
 *   The function or object to convert the name, or the string to prepend to the proprty name.
 * @returns {string} The converted name.
 */
const convertName = (name, nameMap) => {
  if (typeof nameMap === 'function') {
    return nameMap(name);
  }
  if (Object(nameMap) === nameMap) {
    return nameMap[name];
  }
  if (nameMap != null) {
    return `${String(nameMap)}${name[0].toUpperCase()}${name.slice(1)}`;
  }
  return name;
};

/**
 * @param {Object} tokens The object.
 * @param {Function|Object|string} [nameMap]
 *   The function or object to convert the name, or the string to prepend to the proprty name.
 * @returns {Object} The converted object.
 */
const prerfixTokens = (tokens, nameMap) =>
  Object.keys(tokens).reduce((o, key) => {
    const name = convertName(key, nameMap);
    return !name
      ? o
      : {
          ...o,
          [name]: tokens[key],
        };
  }, {});

module.exports = prerfixTokens;
