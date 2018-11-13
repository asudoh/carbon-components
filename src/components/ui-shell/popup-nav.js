import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByLauncher from '../../globals/js/mixins/init-component-by-launcher';
import eventedShowHideState from '../../globals/js/mixins/evented-show-hide-state';
import handles from '../../globals/js/mixins/handles';
import eventedState from '../../globals/js/mixins/evented-state';
import toggleAttribute from '../../globals/js/misc/toggle-attribute';
import on from '../../globals/js/misc/on';
import eventMatches from '../../globals/js/misc/event-matches';
import settings from '../../globals/js/settings';

export default class PopupNav extends mixin(
  createComponent,
  initComponentByLauncher,
  eventedShowHideState,
  handles,
  eventedState
) {
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

  createdByLauncher() {
    const isExpanded = !this.element.hasAttribute('hidden');
    const newState = isExpanded ? 'collapsed' : 'expanded';
    this.changeState(newState);
  }

  /**
   *
   * @param {string} state
   * @returns {boolean} true if given state is different from current state
   */
  shouldStateBeChanged = state => (state === 'expanded') === this.element.hasAttribute('hidden');

  /**
   * Changes the expanded/collapsed state.
   * @private
   * @param {string} state The new state.
   * @param {Function} callback Callback called when change in state completes.
   */
  _changeState = (state, callback) => {
    toggleAttribute(this.element, 'hidden', state !== 'expanded');
    callback();
  };

  /**
   * The map associating DOM element and modal instance.
   * @member Modal.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor, {@linkcode Modal.create .create()}, or {@linkcode Modal.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode Modal.init .init()} works.
   * @member Modal.options
   * @type {Object}
   * @property {string} selectorInit The CSS class to find popup navs.
   * @property {string} attribInitTarget The attribute name in the launcher buttons to find target popup nav.
   * @property {string[]} initEventNames The events that the component will handles
   */
  static get options() {
    const { prefix } = settings;
    return {
      selectorInit: '[data-popup-nav]',
      attribInitTarget: 'data-popup-nav-target',
      initEventNames: ['click'],
      eventBeforeExpanded: 'popup-nav-being-expanded',
      eventAfterExpanded: 'popup-nav-expanded',
      eventBeforeCollapsed: 'popup-nav-being-collapsed',
      eventAfterCollapsed: 'popup-nav-collapsed',
      selectorShellNavSubmenu: `.${prefix}--navigation__category-toggle`,
      selectorShellNavLink: `.${prefix}--navigation-link`,
      selectorShellNavLinkCurrent: `.${prefix}--navigation-item--active,.${prefix}--navigation__category-item--active`,
      selectorShellNavItem: `.${prefix}--navigation-item`,
      classShellNavItemActive: `${prefix}--navigation-item--active`,
      classShellNavLinkCurrent: `${prefix}--navigation__category-item--active`,
      selectorShellNavCategory: `.${prefix}--navigation__category`,
      classShellNavCategoryExpanded: `${prefix}--navigation__category--expanded`,
    };
  }
}
