'use strict';

module.exports = function convertThisExpression(babel) {
  const t = babel.types;

  return {
    visitor: {
      Identifier(path) {
        // babel-plugin-transform-react-jsx creates an identifier with `this` name when `this` is found in pragma:
        // https://www.npmjs.com/package/babel-plugin-transform-react-jsx#pragma
        // `this` as an identifier is ignored by babel-plugin-transform-es2015-arrow-functions, etc.
        if (path.node.name === 'this') {
          path.replaceWith(t.thisExpression());
        }
      },
    },
  };
};
