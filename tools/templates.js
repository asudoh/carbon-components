'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');
const helpers = require('handlebars-helpers');
const Fractal = require('@frctl/fractal');

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
      helpers({ handlebars: fractalDemoViews.components.engine().handlebars });
      this.promiseCache = fractalDemoViews.load().then(([componentSourceDemoViews]) => {
        const fractal = Fractal.create();
        fractal.components.set('path', path.join(__dirname, '../src/components'));
        fractal.components.set('ext', '.hbs');
        fractal.components.set('default.preview', '@preview');
        fractal.docs.set('path', path.join(__dirname, '../docs'));
        helpers({ handlebars: fractal.components.engine().handlebars });
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
