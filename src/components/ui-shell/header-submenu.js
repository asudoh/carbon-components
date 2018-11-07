import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import trackBlur from '../../globals/js/mixins/track-blur';
import on from '../../globals/js/misc/on';

const forEach = Array.prototype.forEach;

class HeaderSubmenu extends mixin(createComponent, initComponentBySearch, handles, trackBlur) {
  constructor(element, options) {
    super(element, options);
    this.manage(on(this.element.ownerDocument, 'click', this._toggle));
  }

  /**
   * Opens and closes the menu.
   * @param {Event} evt The event triggering this action.
   */
  _toggle = evt => {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    if (trigger) {
      const isOfSelf = this.element.contains(evt.target);
      const expanded = trigger.getAttribute(this.options.attribExpanded) === 'true';
      const shouldBeExpanded = isOfSelf && !expanded;
      if (expanded !== shouldBeExpanded) {
        trigger.setAttribute(this.options.attribExpanded, String(shouldBeExpanded));
        forEach.call(this.element.querySelectorAll(this.options.selectorItem), item => {
          item.tabIndex = shouldBeExpanded ? 0 : -1;
        });
      }
    }
  };

  /**
   * Closes the menu if this component loses focus.
   */
  handleBlur() {
    const trigger = this.element.querySelector(this.options.selectorTrigger);
    if (trigger) {
      trigger.setAttribute(this.options.attribExpanded, String(false));
    }
  }

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
      selectorItem: `.${prefix}--header__menu-item`,
      attribExpanded: 'aria-expanded',
    };
  }
}

export default HeaderSubmenu;
