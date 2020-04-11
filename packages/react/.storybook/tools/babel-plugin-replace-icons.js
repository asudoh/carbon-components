/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * A Babel plugin that forces changing the sized icons in `@carbon/icons-react`.
 * @param {Babel} babel The Babel module.
 * @param {Object} options The options.
 * @param {number} options.size The new size.
 */
module.exports = function replaceIcons(babel, { size }) {
  const t = babel.types;

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { node } = path;
        const { value: source } = node.source;
        if (source === '@carbon/icons-react') {
          for (const specifier of path.get('specifiers')) {
            const importedPath = specifier.get('imported');
            const { node: imported } = importedPath;
            const { name } = imported;
            const resizedImported = t.cloneNode(imported);
            resizedImported.name = name.replace(/\d+$/, size);
            importedPath.replaceWith(resizedImported);
          }
        }
      },
    },
  };
};
