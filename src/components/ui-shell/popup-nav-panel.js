import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByLauncher from '../../globals/js/mixins/init-component-by-launcher';
import eventedShowHideState from '../../globals/js/mixins/evented-show-hide-state';
import handles from '../../globals/js/mixins/handles';
import eventedState from '../../globals/js/mixins/evented-state';
import toggleAttribute from '../../globals/js/misc/toggle-attribute';
import settings from '../../globals/js/settings';

export default class PopupNavPanel extends mixin(
  createComponent,
  initComponentByLauncher,
  eventedShowHideState,
  handles,
  eventedState
) {
  createdByLauncher = event => {
    const isExpanded = !this.element.hasAttribute('hidden');
    const newState = isExpanded ? 'collapsed' : 'expanded';
    this.triggerButton = event.delegateTarget;
    this.changeState(newState);
  };

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
   * The map associating DOM element and PopupNavPanel instance.
   * @member PopupNavPanel.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode PopupNavPanel.create .create()}, or
   * {@linkcode PopupNavPanel.init .init()},
   * properties in this object are overriden for the instance being create and
   * how {@linkcode PopupNavPanel.init .init()} works.
   * @member PopupNavPanel.options
   * @type {Object}
   * @property {string} selectorInit The CSS class to find popup navs.
   * @property {string} attribInitTarget The attribute name in the launcher buttons to find target popup nav.
   * @property {string[]} initEventNames The events that the component will handles
   */
  static get options() {
    const { prefix } = settings;
    return {
      initEventNames: ['click'],
      eventBeforeExpanded: 'popup-nav-being-expanded',
      eventAfterExpanded: 'popup-nav-expanded',
      eventBeforeCollapsed: 'popup-nav-being-collapsed',
      eventAfterCollapsed: 'popup-nav-collapsed',
      classPopupNavPanelHeaderActionActive: `${prefix}--header__action--active`,
      attribLabelExpand: 'data-popup-nav-panel-label-expand',
      attribLabelCollapse: 'data-popup-nav-panel-label-collapse',
    };
  }
}
