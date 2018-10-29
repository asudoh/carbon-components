'use strict';

const { componentsX } = require('../../globals/js/feature-flags');

module.exports = {
  variants: [
    {
      name: 'default',
      label: 'Text Input',
      notes: `
        Text fields enable the user to interact with and input data. A single line
        field is used when the input anticipated by the user is a single line of
        text as opposed to a paragraph.
      `,
      context: {
        componentsX,
      },
    },
    {
      name: 'light',
      label: 'Text Input (Light)',
      context: {
        componentsX,
        light: true,
      },
    },
    {
      name: 'password',
      label: 'Password Input',
      context: {
        componentsX,
        password: true,
      },
    },
    {
      name: 'password--light',
      label: 'Password Input (Light)',
      context: {
        componentsX,
        light: true,
        password: true,
      },
    },
  ],
};
