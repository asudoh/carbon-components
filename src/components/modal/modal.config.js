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
        classPrimaryButton: 'bx--btn--primary',
        classCloseButton: 'bx--btn--secondary',
      },
    },
    {
      name: 'nofooter',
      label: 'Without footer',
      notes: 'Passive modals are modals without footers.',
      context: {
        hasFooter: false,
        classPrimaryButton: 'bx--btn--primary',
        classCloseButton: 'bx--btn--secondary',
      },
    },
    {
      name: 'danger',
      label: 'Danger',
      context: {
        hasFooter: true,
        labelPrimaryButton: 'Danger',
        classModalSupplemental: 'bx--modal--danger',
        classPrimaryButton: 'bx--btn--danger--primary',
        classCloseButton: 'bx--btn--tertiary',
      },
    },
  ],
};
