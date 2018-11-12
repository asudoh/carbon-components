import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

class SideNav extends mixin(createComponent, initComponentBySearch, handles) {
  /**
   * Side nav.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a side nav.
   * @param {Object} [options] The component options.
   */
  constructor(element, options) {
    super(element, options);
    this.manage(on(this.element, 'click', this._handleClick));
  }

  /**
   * Handles click on content switcher button set.
   * If the click is on a content switcher button, activates it.
   * @param {Event} event The event triggering this method.
   */
  _handleClick = event => {
    const buttonNode = eventMatches(event, this.options.selectorToggle);
    const itemToggleNode = eventMatches(event, this.options.selectorItemToggle);
    if (buttonNode) {
      this.changeState(!this.isExpanded() ? 'expanded' : 'collapsed');
    }
    if (itemToggleNode) {
      itemToggleNode.setAttribute('aria-expanded', itemToggleNode.getAttribute('aria-expanded') !== 'true');
    }
  };

  /**
   * @returns {boolean} `true` if the nav is expanded.
   */
  isExpanded() {
    return this.element.classList.contains(this.options.classNavExpanded);
  }

  /**
   * Changes the expanded/collapsed state.
   */
  changeState(state) {
    // TODO: When the nav collapses, it still looks expanded as the mouse tends to be on the trigger button.
    // May need to see with designers if we should temporarily disable the hover over action.
    this.element.classList.toggle(this.options.classNavExpanded, state === 'expanded');
  }

  /**
   * The map associating DOM element and copy button UI instance.
   * @member SideNav.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor, {@linkcode SideNav.create .create()}, or {@linkcode SideNav.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode SideNav.init .init()} works.
   * @member SideNav.options
   * @type {Object}
   * @property {string} selectorInit The data attribute to find side navs.
   */
  static get options() {
    const { prefix } = settings;
    return {
      selectorInit: '[data-side-nav]',
      selectorNavExpanded: `.${prefix}--side-nav--expanded`,
      selectorToggle: `.${prefix}--side-nav__toggle`,
      selectorToggleIcon: `.${prefix}--side-nav__icon > svg`,
      selectorItemToggle: `.${prefix}--side-nav__submenu`,
      classNavExpanded: `${prefix}--side-nav--expanded`,
    };
  }
}

export default SideNav;
