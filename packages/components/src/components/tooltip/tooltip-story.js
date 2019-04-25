import { storiesOf } from '@storybook/polymer';
import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { prefix } from '../../globals/js/settings';
import interactiveTemplate from './tooltip.hbs';
import definitionTemplate from './tooltip--definition.hbs';
import iconTemplate from './tooltip--icon.hbs';
import '../button/_button.scss';
import '../link/_link.scss';
import './_tooltip.scss';

storiesOf('Tooltip', module)
  .add(
    'Interactive tooltip',
    () => html`
      ${unsafeHTML(interactiveTemplate({ prefix }))}
    `
  )
  .add(
    'Definition tooltip',
    () => html`
      ${unsafeHTML(definitionTemplate({ prefix }))}
    `
  )
  .add(
    'Icon tooltip',
    () => html`
      ${unsafeHTML(iconTemplate({ prefix }))}
    `
  );
