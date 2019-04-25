import { html } from 'lit-html';
import { configure, addDecorator } from '@storybook/polymer';
import { withOptions } from '@storybook/addon-options';
import watch from '../src/globals/js/watch';
import '../demo/polyfills';
import './_container.scss';

addDecorator(
  story => html`
    <div
      data-floating-menu-container
      role="main"
      style="padding: 3em; display: flex; flex-direction: column; align-items: center"
    >
      ${story()}
    </div>
    <input aria-label="input-text-offleft" type="text" class="bx--visually-hidden" />
  `
);

addDecorator(
  withOptions({
    name: `carbon components`,
    url: 'https://github.com/IBM/carbon-components',
  })
);

function loadStories() {
  const req = require.context('../src/components', true, /\-story\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
watch();
