'use stirct';

module.exports = {
  default: 'primary',
  variants: [
    {
      name: 'primary',
      label: 'Primary Buttons',
      notes: 'Primary buttons should be used for the principle call to action on the page.',
      context: {
        variant: 'primary',
      },
    },
    {
      name: 'primary--small',
      label: 'Primary Buttons (Small)',
      notes: `
        Small buttons may be used when there is not enough space for a
        regular sized button. This issue is most found in tables. Small button should have three words
        or less.
      `,
      context: {
        variant: 'primary',
        small: true,
      },
    },
    {
      name: 'secondary',
      label: 'Secondary Buttons',
      notes: 'Secondary buttons should be used for secondary actions on each page.',
      context: {
        variant: 'secondary',
      },
    },
    {
      name: 'secondary--small',
      label: 'Secondary Buttons (Small)',
      notes: `
        Small buttons may be used when there is not enough space for a
        regular sized button. This issue is most found in tables. Small button should have three words
        or less.
      `,
      context: {
        variant: 'secondary',
        small: true,
      },
    },
    {
      name: 'danger',
      label: 'Danger Buttons',
      notes: 'Danger buttons should be used for a negative action (such as Delete) on the page.',
      context: {
        variant: 'danger',
      },
    },
    {
      name: 'danger--small',
      label: 'Danger Buttons (Small)',
      notes: `
        Small buttons may be used when there is not enough space for a
        regular sized button. This issue is most found in tables. Small button should have three words
        or less.
      `,
      context: {
        variant: 'danger',
        small: true,
      },
    },
    {
      name: 'ghost',
      label: 'Ghost Buttons',
      context: {
        variant: 'ghost',
      },
    },
    {
      name: 'ghost--small',
      label: 'Ghost Buttons (Small)',
      notes: `
        Small buttons may be used when there is not enough space for a
        regular sized button. This issue is most found in tables. Small button should have three words
        or less.
      `,
      context: {
        variant: 'ghost',
        small: true,
      },
    },
  ],
};
