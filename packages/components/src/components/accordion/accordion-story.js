import { storiesOf } from '@storybook/polymer';
import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { prefix } from '../../globals/js/settings';
import defaultTemplate from './accordion.hbs';
import legacyTemplate from './accordion--legacy.hbs';
import './_accordion.scss';

storiesOf('Accordion', module)
  .add(
    'Default',
    () => html`
      ${unsafeHTML(
        defaultTemplate({
          prefix,
          sections: [
            {
              title: 'Section 1 title',
              paneId: 'pane1',
            },
            {
              title: 'Section 2 title',
              paneId: 'pane2',
            },
            {
              title: 'Section 3 title',
              paneId: 'pane3',
            },
            {
              title: 'Section 4 title',
              paneId: 'pane4',
            },
          ],
        })
      )}
    `
  )
  .add(
    'Legacy',
    () => html`
      ${unsafeHTML(
        legacyTemplate({
          prefix,
          sections: [
            {
              title: 'Section 1 title',
              paneId: 'pane1',
            },
            {
              title: 'Section 2 title',
              paneId: 'pane2',
            },
            {
              title: 'Section 3 title',
              paneId: 'pane3',
            },
            {
              title: 'Section 4 title',
              paneId: 'pane4',
            },
          ],
        })
      )}
    `
  );
