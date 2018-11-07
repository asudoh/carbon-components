import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

class HeaderSubmenu extends mixin(createComponent, initComponentBySearch, handles) {
  constructor(element, options) {
    super(element, options);
    this.manage(on(this.element, 'click', this._handleClick));
  }

  /**
   * Handles click button.
   * @param {Event} evt The event triggering this action.
   */
  _handleClick = evt => {
    const trigger = eventMatches(evt, this.options.selectorTrigger);
    if (trigger) {
      console.log('Trigger button clicked!'); // eslint-disable-line no-console
    }
  };

  /**
   * The map associating DOM element and copy button UI instance.
   * @member HeaderSubmenu.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode HeaderSubmenu.create .create()}, or {@linkcode HeaderSubmenu.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode HeaderSubmenu.init .init()} works.
   * @member HeaderSubmenu.options
   * @type {Object}
   * @property {string} selectorInit The data attribute to find side navs.
   */
  static get options() {
    const { prefix } = settings;
    return {
      selectorInit: '[data-header-submenu]',
      selectorTrigger: `.${prefix}--header__menu-title`,
    };
  }
}

export default HeaderSubmenu;
