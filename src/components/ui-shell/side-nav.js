import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import settings from '../../globals/js/settings';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';
import eventMatches from '../../globals/js/misc/event-matches';

class SideNav extends mixin(createComponent, initComponentBySearch, handles) {
  /**
   * The map associating DOM element and copy button UI instance.
   * @member SideNav.components
   * @type {WeakMap}
   */
  static components = new WeakMap();
  constructor(element, options) {
    super(element, options);
    this.manage(on(element, 'click', this._handleClick));
  }

  /**
   * Enum for toggling side nav visibility
   * @readonly
   * @member SideNav.state
   * @type {Object}
   * @property {number} EXPANDED Opening/visible
   * @property {number} COLLAPSED Closing/hidden
   */
  static state = {
    EXPANDED: 'expanded',
    COLLAPSED: 'collapsed',
  };

  /**
   * @returns {boolean} `true` if the nav is expanded.
   */
  isNavExpanded() {
    return this.element.classList.contains(this.options.classSideNavExpanded);
  }

  /**
   * Changes the expanded/collapsed state.
   */
  changeState(state) {
    this.element.classList.toggle(this.options.classSideNavExpanded, state === this.constructor.state.EXPANDED);
  }

  _handleClick = evt => {
    const matchesToggle = eventMatches(evt, this.options.selectorSideNavToggle);
    const matchesNavSubmenu = eventMatches(evt, this.options.selectorSideNavSubmenu);
    if (!matchesToggle && !matchesNavSubmenu) {
      return;
    }
    if (matchesToggle) {
      this.changeState(!this.isNavExpanded() ? this.constructor.state.EXPANDED : this.constructor.state.COLLAPSED);
      return;
    }
    if (matchesNavSubmenu) {
      const isSubmenuExpanded = matchesNavSubmenu.getAttribute('aria-expanded') === 'true';
      matchesNavSubmenu.setAttribute('aria-expanded', `${!isSubmenuExpanded}`);
    }
  };

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
      selectorSideNavToggle: `.${prefix}--side-nav__toggle`,
      selectorSideNavSubmenu: `.${prefix}--side-nav__submenu`,
      classSideNavExpanded: `${prefix}--side-nav--expanded`,
    };
  }
}

export default SideNav;
