import { storiesOf } from '@storybook/polymer';
import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { prefix } from '../../globals/js/settings';
import template from './modal.hbs';
import '../text-input/_text-input.scss';
import './_modal.scss';

storiesOf('Modal', module)
  .add(
    'Transactional modal',
    () => html`
      ${unsafeHTML(
        template({
          prefix,
          idSuffix: Math.random()
            .toString(36)
            .substr(2),
          hasFooter: true,
          classPrimaryButton: `${prefix}--btn--primary`,
          classCloseButton: `${prefix}--btn--secondary`,
        })
      )}
    `
  )
  .add(
    'Passive modal',
    () => html`
      ${unsafeHTML(
        template({
          prefix,
          idSuffix: Math.random()
            .toString(36)
            .substr(2),
          hasFooter: false,
          classPrimaryButton: `${prefix}--btn--primary`,
          classCloseButton: `${prefix}--btn--secondary`,
        })
      )}
    `
  )
  .add(
    'Danger modal',
    () => html`
      ${unsafeHTML(
        template({
          prefix,
          idSuffix: Math.random()
            .toString(36)
            .substr(2),
          hasFooter: true,
          labelPrimaryButton: 'Danger',
          classModalSupplemental: `${prefix}--modal--danger`,
          classPrimaryButton: `${prefix}--btn--danger`,
          classCloseButton: `${prefix}--btn--secondary`,
        })
      )}
    `
  )
  .add(
    'Input modal',
    () => html`
      ${unsafeHTML(
        template({
          prefix,
          idSuffix: Math.random()
            .toString(36)
            .substr(2),
          hasInput: true,
          hasFooter: true,
          classPrimaryButton: `${prefix}--btn--primary`,
          classCloseButton: `${prefix}--btn--secondary`,
        })
      )}
    `
  );
