'use strict';

const globby = require('globby');
const { promisify } = require('bluebird');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const helpers = require('handlebars-helpers');
const Fractal = require('@frctl/fractal');
const createHandlebarsAdapter = require('@frctl/handlebars');

const origResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveModule(request, parentModule, ...other) {
  const devFeatureFlags = path.resolve(__dirname, '../demo/feature-flags.js');
  const newRequest =
    !/feature-flags$/i.test(request) || !fs.existsSync(devFeatureFlags)
      ? request
      : path.relative(path.dirname(parentModule.id), devFeatureFlags);
  return origResolveFilename.call(this, newRequest, parentModule, ...other);
};

try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const logger = require(path.resolve(path.dirname(require.resolve('@frctl/fractal')), 'core/log'));
  ['log', 'error', 'warn'].forEach(name => {
    logger.on(name, evt => {
      console[name](`Fractal ${name}:`, evt); // eslint-disable-line no-console
    });
  });
} catch (err) {
  console.error('Failed to hook Fractal logger', err.stack); // eslint-disable-line no-console
}

const readFile = promisify(fs.readFile);

/**
 * @param {string} glob A glob.
 * @returns {Set<string, string>} A set of file contents matching the given glob, keyed by the basename of the file.
 */
const getContents = glob =>
  globby(glob).then(filePaths => {
    if (filePaths.length === 0) {
      return undefined;
    }
    const contents = {};
    return Promise.all(
      filePaths.map(filePath =>
        readFile(filePath, { encoding: 'utf8' }).then(content => {
          contents[path.basename(filePath, path.extname(filePath))] = content;
        })
      )
    ).then(() => contents);
  });

const cache = {
  /**
   * @returns {Promise<Object>} The promise that is resolved with the content cache.
   */
  get() {
    if (!this.promiseCache) {
      // Fractal does not have "multiple paths" feature, which does not work well our directory structure
      const fractalDemoViews = Fractal.create();
      fractalDemoViews.components.set('path', path.join(__dirname, '../demo/views'));
      fractalDemoViews.components.set('ext', '.hbs');
      fractalDemoViews.components.engine(createHandlebarsAdapter({ helpers: helpers() }));
      this.promiseCache = Promise.all([
        fractalDemoViews.load(),
        getContents(path.resolve(__dirname, '../{demo,src}/**/*.hbs')),
      ]).then(([sourcesDemoViews, contents]) => {
        const [componentSourceDemoViews] = sourcesDemoViews;
        const fractal = Fractal.create();
        fractal.components.set('path', path.join(__dirname, '../src/components'));
        fractal.components.set('ext', '.hbs');
        fractal.components.set('default.preview', '@preview');
        fractal.components.engine(
          createHandlebarsAdapter({
            helpers: helpers(),
            partials: contents,
          })
        );
        fractal.docs.set('path', path.join(__dirname, '../docs'));
        return fractal.load().then(([componentSource, docSource]) => {
          componentSourceDemoViews.flatten().forEach(item => {
            componentSource.pushItem(item);
          });
          return {
            componentSource,
            docSource,
          };
        });
      });
    }
    return this.promiseCache;
  },

  /**
   * Clears the content cache.
   */
  clear() {
    this.promiseCache = undefined;
  },
};

module.exports = {
  cache,
};
