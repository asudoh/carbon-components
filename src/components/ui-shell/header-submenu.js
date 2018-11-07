import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';

class HeaderSubmenu extends mixin(createComponent, initComponentBySearch) {
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
  static options = {
    selectorInit: '[data-header-submenu]',
  };
}

export default HeaderSubmenu;
