import NavigationMenuPanel from './navigation-menu-panel';
import settings from '../../globals/js/settings';

export default class ProductSwitcher extends NavigationMenuPanel {
  /**
   * The list of the IDs of the trigger buttons that have been used.
   * @type {Set}
   */
  triggerButtonIds = new Set();

  createdByLauncher = event => {
    const isExpanded = this.element.classList.contains(this.options.classProductSwitcherExpanded);
    const launcher = event.delegateTarget;
    if (!launcher.id) {
      launcher.id = `__carbon-product-switcher-launcher-${Math.random()
        .toString(36)
        .substr(2)}`;
    }
    const current = launcher.id;
    this.changeState(isExpanded && this.current === current ? this.constructor.SELECT_NONE : current);
  };

  /**
   * @param {Element} current The trigger button of the switcher to be activated. `null` for deactivating.
   * @returns {boolean} true if given state is different from current state.
   */
  shouldStateBeChanged = current => this.current !== current;

  /**
   * Changes the expanded/collapsed state.
   * @private
   * @param {string} current The new state.
   * @param {Function} callback Callback called when change in state completes.
   */
  _changeState = (current, callback) => {
    this.current = current;
    if (this.current !== this.constructor.SELECT_NONE) {
      this.triggerButtonIds.add(this.current);
    }
    this.triggerButtonIds.forEach(id => {
      const button = this.element.ownerDocument.getElementById(id);
      const label = button.getAttribute(this.options.attribLabelExpand);
      button.classList.remove(this.options.classNavigationMenuPanelHeaderActionActive);
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    });
    if (this.current !== this.constructor.SELECT_NONE) {
      const button = this.element.ownerDocument.getElementById(this.current);
      const label = button.getAttribute(this.options.attribLabelCollapse);
      button.classList.add(this.options.classNavigationMenuPanelHeaderActionActive);
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    }
    this.element.classList.toggle(this.options.classProductSwitcherExpanded, current !== this.constructor.SELECT_NONE);
    callback();
  };

  release() {
    this.triggerButtonIds.clear();
    return super.release();
  }

  /**
   * A magic string indicting that no product switcher should be selected.
   * @param {string}
   */
  static SELECT_NONE = '__carbon-product-switcher-launcher-NONE';

  /**
   * The map associating DOM element and ProductSwitcher instance.
   * @member ProductSwitcher.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode ProductSwitcher.create .create()}, or
   * {@linkcode ProductSwitcher.init .init()},
   * properties in this object are overriden for the instance being create and
   * how {@linkcode ProductSwitcher.init .init()} works.
   * @member ProductSwitcher.options
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
      selectorInit: '[data-product-switcher]',
      attribInitTarget: 'data-product-switcher-target',
      classProductSwitcherExpanded: `${prefix}--panel--expanded`,
    });
  }
}
