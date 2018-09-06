'use strict';

module.exports = {
  extends: ['stylelint-config-sass-guidelines', 'stylelint-config-property-sort-order-smacss', 'stylelint-config-prettier'],
  rules: {
    // Carnon has widespread usage of `border:none`, etc.
    // TODO: Consider re-enabling this rule
    'declaration-property-value-blacklist': null,
    // Carbon uses empty `url-prefix()` for Gecko-only styles
    'function-url-quotes': null,
    // Use `selector-max-compound-selectors` to limit selector complexity
    // Use `selector-nested-pattern` to avoid nesting except pseudos
    'max-nesting-depth': null,
    // Carbon uses vendor-prefixed media feature for Gecko-only styles
    'media-feature-name-no-vendor-prefix': null,
    // Carbon's standard BEM pattern
    'selector-class-pattern': [
      '^[a-z](-?[a-z0-9]+)*((__|--)[a-z0-9](-?[a-z0-9]+)*)*$',
      {
        message: 'Should use BEM',
      },
    ],
    // Allow Sass nesting only for pseudo classes/elements
    'selector-nested-pattern': '^&(::?[a-z-]+(\\(.+?\\))?)+(,\\s*&(::?[a-z-]+(\\(.+?\\))?)+)*$',
    // TODO: We may want to consider re-enabling this in future
    'selector-pseudo-element-colon-notation': null,
    // TODO: Re-enable this soon
    'order/properties-order': null,
    // We use sort order from SMACSS one only
    'order/properties-alphabetical-order': null,
    // Carbon's standard mixin naming pattern, similar to BEM
    'scss/at-mixin-pattern': [
      '^[a-z](-?[a-z0-9]+)*((__|--)[a-z0-9](-?[a-z0-9]+)*)*$',
      {
        message: 'Should use single/double dash/underbar as separators',
      },
    ],
    // Supports the pattern of IBM colors
    'scss/dollar-variable-pattern': '^_?[a-z]+([a-z0-9-_]+[a-z0-9]+)?$',
  },
  ignoreFiles: [
    'node_modules/**/*',
    // JSDoc output
    'docs/js/**/*',
    // Istanbul output
    'tests/coverage/**/*',
    '**/LICENSE',
    // All `.css` files in this repository are generated ones
    '**/*.css',
    '**/*.hbs',
    '**/*.json',
    '**/*.log',
    '**/*.map',
    // TODO: We may want to run StyleLint against `.md` files in future
    '**/*.md',
    '**/*.sh',
    '**/*.woff',
    '**/*.woff2',
    '**/*.yml',
    // Generated `.scss` files
    'scss/**/*',
    // Beow are 3rd-party files
    'src/components/date-picker/_flatpickr.scss',
    'src/globals/scss/_colors.scss',
    'demo/scss/_prism.scss',
  ],
};
