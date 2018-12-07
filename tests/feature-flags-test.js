/**
 * @jest-environment node
 */

/* global describe it expect */

// eslint-disable-next-line strict,lines-around-directive
'use strict';

const { promisify } = require('util');
const sass = require('node-sass');

const render = promisify(sass.render);

const defaultOptions = {
  includePaths: ['node_modules'],
};

describe('feature-flags', () => {
  const content = `
    body {
      @if feature-flag-enabled('grid') {
        --grid: enabled;
      } @else {
        --grid: disabled;
      }
      @if feature-flag-enabled('grid--fallback') {
        --grid--fallback: enabled;
      } @else {
        --grid--fallback: disabled;
      }
    }
  `;
  const regexContent = /^\s*body\s*{\s*--grid:\s*(enabled|disabled);\s*--grid--fallback:\s*(enabled|disabled);\s*}\s*$/m;

  it('should disable grid and grid fallback by default', async () => {
    const result = await render({
      data: `
        @import 'src/globals/scss/functions';
        ${content}
      `,
      ...defaultOptions,
    });
    const tokens = regexContent.exec(result.css);
    expect(tokens[1]).toBe('disabled');
    expect(tokens[2]).toBe('disabled');
  });

  it('should honor grid and grid fallback by default', async () => {
    const resultDisabled = await render({
      data: `
        $css--use-experimental-grid: false;
        $css--use-experimental-grid-fallback: false;
        @import 'src/globals/scss/functions';
          ${content}
      `,
      ...defaultOptions,
    });
    const tokensDisabled = regexContent.exec(resultDisabled.css);
    expect(tokensDisabled[1]).toBe('disabled');
    expect(tokensDisabled[2]).toBe('disabled');
    const resultEnabled = await render({
      data: `
        $css--use-experimental-grid: true;
        $css--use-experimental-grid-fallback: true;
        @import 'src/globals/scss/functions';
          ${content}
      `,
      ...defaultOptions,
    });
    const tokensEnabled = regexContent.exec(resultEnabled.css);
    expect(tokensEnabled[1]).toBe('enabled');
    expect(tokensEnabled[2]).toBe('enabled');
  });

  it('should enable grid by default for v10', async () => {
    const result = await render({
      data: `
        $feature-flags: (breaking-changes-x: true);
        @import 'src/globals/scss/functions';
        ${content}
      `,
      ...defaultOptions,
    });
    const tokens = regexContent.exec(result.css);
    expect(tokens[1]).toBe('enabled');
    expect(tokens[2]).toBe('disabled');
  });

  it('should ignore legacy grid flag for v10', async () => {
    const result = await render({
      data: `
        $css--use-experimental-grid: false;
        $css--use-experimental-grid-fallback: false;
        $feature-flags: (breaking-changes-x: true);
        @import 'src/globals/scss/functions';
        ${content}
      `,
      ...defaultOptions,
    });
    const tokens = regexContent.exec(result.css);
    expect(tokens[1]).toBe('enabled');
    expect(tokens[2]).toBe('disabled');
  });

  it('should look at grid feature flag rather than legacy feature flag for v10', async () => {
    const result = await render({
      data: `
        $css--use-experimental-grid: true;
        $feature-flags: (breaking-changes-x: true, grid: false);
        @import 'src/globals/scss/functions';
        ${content}
      `,
      ...defaultOptions,
    });
    expect(regexContent.exec(result.css)[1]).toBe('disabled');
  });
});
