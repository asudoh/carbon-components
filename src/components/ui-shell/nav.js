import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByLauncher from '../../globals/js/mixins/init-component-by-launcher';
import handles from '../../globals/js/mixins/handles';

class PopupNav extends mixin(createComponent, initComponentByLauncher, handles) {
  createdByLauncher() {
    this.changeState(!this.isExpanded() ? 'expanded' : 'collapsed');
  }

  isExpanded() {
    return !this.element.hasAttribute('hidden');
  }

  changeState(state) {
    if (state === 'expanded') {
      this.element.removeAttribute('hidden');
    } else {
      this.element.setAttribute('hidden', '');
    }
  }

  /**
   * The map associating DOM element and copy button UI instance.
   * @member PopupNav.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor, {@linkcode PopupNav.create .create()}, or {@linkcode PopupNav.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode PopupNav.init .init()} works.
   * @member PopupNav.options
   * @type {Object}
   * @property {string} selectorInit The data attribute to find popup navs.
   */
  static options = {
    selectorInit: '[data-popup-nav]',
    attribInitTarget: 'data-popup-nav-target',
    initEventNames: ['click'],
  };
}

export default PopupNav;
