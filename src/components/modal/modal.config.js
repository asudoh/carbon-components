'use stirct';

module.exports = {
  variants: [
    {
      name: 'default',
      label: 'Default',
      notes: `
        Modals communicate information via a secondary window and allow the user to maintain the context of a particular task.
      `,
      context: {
        hasFooter: true,
      },
    },
    {
      name: 'nofooter',
      label: 'Without footer',
      notes: 'Passive modals are modals without footers.',
      context: {
        hasFooter: false,
      },
    },
  ],
};
