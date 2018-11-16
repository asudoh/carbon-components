import NavigationMenuPanel from './navigation-menu-panel';
import on from '../../globals/js/misc/on';
import eventMatches from '../../globals/js/misc/event-matches';
import settings from '../../globals/js/settings';

export default class NavigationMenu extends NavigationMenuPanel {
  constructor(element, options) {
    super(element, options);
    this.manage(on(element, 'click', this._handleClick));
  }

  _handleClick = evt => {
    const matchesNavSubmenu = eventMatches(evt, this.options.selectorShellNavSubmenu);
    const matchesShellNavLink = eventMatches(evt, this.options.selectorShellNavLink);
    if (!matchesNavSubmenu && !matchesShellNavLink) {
      return;
    }
    if (matchesNavSubmenu) {
      const shellNavCategory = matchesNavSubmenu.closest(this.options.selectorShellNavCategory);
      if (!shellNavCategory) {
        return;
      }
      const isExpanded = matchesNavSubmenu.getAttribute('aria-expanded') === 'true';
      matchesNavSubmenu.setAttribute('aria-expanded', !isExpanded);
      shellNavCategory.classList.toggle(this.options.classShellNavCategoryExpanded);
      return;
    }
    if (matchesShellNavLink) {
      [...this.element.querySelectorAll(this.options.selectorShellNavLinkCurrent)].forEach(el => {
        el.classList.remove(this.options.classShellNavItemActive, this.options.classShellNavLinkCurrent);
      });
      matchesShellNavLink.classList.add(this.options.classShellNavItemActive);
    }
  };

  /**
   * The map associating DOM element and NavigationMenu instance.
   * @member NavigationMenu.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode NavigationMenu.create .create()}, or
   * {@linkcode NavigationMenu.init .init()},
   * properties in this object are overriden for the instance being create and
   * how {@linkcode NavigationMenu.init .init()} works.
   * @member NavigationMenu.options
   * @type {Object}
   * @property {string} selectorInit The CSS class to find popup navs.
   * @property {string} attribInitTarget The attribute name in the
   * launcher buttons to find target popup nav.
   * @property {string[]} initEventNames The events that the component
   * will handles
   */
  static get options() {
    const { prefix } = settings;
    return Object.assign(Object.create(NavigationMenuPanel.options), {
      selectorInit: '[data-navigation-menu]',
      attribInitTarget: 'data-navigation-menu-target',
      selectorShellNavSubmenu: `.${prefix}--navigation__category-toggle`,
      selectorShellNavLink: `.${prefix}--navigation-link`,
      selectorShellNavLinkCurrent: `.${prefix}--navigation-item--active,.${prefix}--navigation__category-item--active`,
      selectorShellNavItem: `.${prefix}--navigation-item`,
      selectorShellNavCategory: `.${prefix}--navigation__category`,
      classShellNavItemActive: `${prefix}--navigation-item--active`,
      classShellNavLinkCurrent: `${prefix}--navigation__category-item--active`,
      classShellNavCategoryExpanded: `${prefix}--navigation__category--expanded`,
    });
  }
}
