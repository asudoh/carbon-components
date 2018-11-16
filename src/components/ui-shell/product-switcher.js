import PopupNavPanel from './popup-nav-panel';
import settings from '../../globals/js/settings';

export default class ProductSwitcher extends PopupNavPanel {
  createdByLauncher = event => {
    const isExpanded = this.element.classList.contains(this.options.classProductSwitcherExpanded);
    const newState = isExpanded ? 'collapsed' : 'expanded';
    this.triggerButton = event.delegateTarget;
    this.changeState(newState);
  };

  /**
   *
   * @param {string} state
   * @returns {boolean} true if given state is different from current state
   */
  shouldStateBeChanged = state =>
    (state === 'expanded') !== this.element.classList.contains(this.options.classProductSwitcherExpanded);

  /**
   * Changes the expanded/collapsed state.
   * @private
   * @param {string} state The new state.
   * @param {Function} callback Callback called when change in state completes.
   */
  _changeState = (state, callback) => {
    this.element.classList.toggle(this.options.classProductSwitcherExpanded, state === 'expanded');
    if (this.triggerButton) {
      const label =
        state === 'expanded'
          ? this.triggerButton.getAttribute(this.options.attribLabelCollapse)
          : this.triggerButton.getAttribute(this.options.attribLabelExpand);
      this.triggerButton.classList.toggle(this.options.classPopupNavPanelHeaderActionActive, state === 'expanded');
      this.triggerButton.setAttribute('aria-label', label);
      this.triggerButton.setAttribute('title', label);
    }
    callback();
  };

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
    return Object.assign(Object.create(PopupNavPanel.options), {
      selectorInit: '[data-product-switcher]',
      attribInitTarget: 'data-product-switcher-target',
      classProductSwitcherExpanded: `${prefix}--panel--expanded`,
    });
  }
}
