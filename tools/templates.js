'use strict';

const globby = require('globby');
const { promisify } = require('bluebird');
const fs = require('fs');
const path = require('path');
const dust = require('dustjs-linkedin');
const helpers = require('dustjs-helpers');
const Fractal = require('@frctl/fractal');

const readFile = promisify(fs.readFile);
const render = promisify(dust.render);

dust.config.whitespace = true;
Object.assign(dust.helpers, helpers);

/**
 * @param {string} glob A glob.
 * @returns {Set<string, string>} A set of file contents matching the given glob, keyed by the basename of the file.
 */
const getContents = glob =>
  globby(glob).then(filePaths => {
    if (filePaths.length === 0) {
      return undefined;
    }
    const contents = new Map();
    return Promise.all(
      filePaths.map(filePath =>
        readFile(filePath, { encoding: 'utf8' }).then(content => {
          contents.set(path.basename(filePath, '.dust'), content);
        })
      )
    ).then(() => contents);
  });

/**
 * Loads Dust templates and compiles them.
 * @param {string} glob A glob.
 * @returns {Set<string, string>} A set of file contents matching the given glob, keyed by the basename of the file.
 */
const loadContents = glob =>
  getContents(glob).then(contents => {
    contents.forEach((content, templateName) => {
      dust.loadSource(dust.compile(content, templateName));
    });
    return contents;
  });

const fractal = Fractal.create();
fractal.components.set('path', path.join(__dirname, '../src/components'));
fractal.components.set('ext', '.dust');
fractal.docs.set('path', path.join(__dirname, '../docs'));

const promiseCache = Promise.all([fractal.load(), loadContents(path.resolve(__dirname, '../{demo,src}/**/*.dust'))]).then(
  ([sources, contents]) => {
    const [componentSource, docSource] = sources;
    return {
      componentSource,
      docSource,
      contents,
    };
  }
);

/**
 * @param {Object} [options] The options.
 * @param {string} [options.preview] The preview Dust template name to force. Useful to force an empty preview.
 * @param {string} [options.defauktPreview] The preview Dust template name working as the default one.
 * @param {boolean} [options.concat] Setting `true` here returns rendered contents all concatenated, instead of returning a map.
 * @param {string} [handle]
 *   The internal component name seen in Fractal.
 *   Can be of a component or of a variant, or left empty.
 *   Leaving `handle` empty renders all components.
 * @returns {string|Map<Variant, string>} The list of rendered template, keyed by Fractal `Variant` object.
 */
const renderComponent = ({ preview, defaultPreview, concat } = {}, handle) =>
  promiseCache.then(({ componentSource, contents }) => {
    const promises = [];
    const renderedItems = new Map();
    componentSource.forEach(metadata => {
      const items = metadata.isCollection ? metadata : !metadata.isCollated && metadata.variants && metadata.variants();
      if (items) {
        const filteredItems = !handle || handle === metadata.handle ? items : items.filter(item => handle === item.handle);
        filteredItems.forEach(item => {
          const { handle: itemHandle, baseHandle, context } = item;
          const template = contents.has(itemHandle) ? itemHandle : baseHandle;
          promises.push(
            render(template, Object.assign({}, context, { preview: preview || item.preview || defaultPreview })).then(
              rendered => {
                renderedItems.set(item, rendered);
              }
            )
          );
        });
      }
    });
    return Promise.all(promises).then(() => {
      if (!concat) {
        return renderedItems;
      }
      const accumulated = [];
      renderedItems.forEach(rendered => {
        accumulated.push(rendered);
      });
      return accumulated.join('\n');
    });
  });

module.exports = {
  promiseCache,
  render: renderComponent,
};
