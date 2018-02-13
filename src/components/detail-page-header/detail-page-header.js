import warning from 'warning';
import debounce from 'lodash.debounce';
import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';
import defaultOptions from './options';

let didWarnAboutDeprecation = false;

class DetailPageHeader extends mixin(createComponent, initComponentBySearch, handles) {
  /**
   * The Detail Page Header.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a page header.
   * @param {Object} [options] The component options.
   */
  constructor(element, options) {
    super(element, options);

    this.previousScrollY = 0;
    // Debounce scroll event calls to handleScroll (default: 50)
    const debouncedScroll = debounce(this._handleScroll.bind(this), 25);
    this.manage(on(this.element.ownerDocument.defaultView, 'scroll', debouncedScroll));
    if (__DEV__) {
      warning(
        didWarnAboutDeprecation,
        'Accessing the `detail-page-header` component from the ' +
          '`carbon-components` package is deprecated. Use the ' +
          '`carbon-addons-bluemix` package instead.'
      );
      didWarnAboutDeprecation = true;
    }
  }

  /**
   * Adds class to header based on users position on the page
   */
  _handleScroll() {
    let scrollPosition;
    if (this.element.ownerDocument.defaultView.pageYOffset) {
      scrollPosition = this.element.ownerDocument.defaultView.pageYOffset;
    } else {
      scrollPosition = this.element.ownerDocument.defaultView.pageYOffset;
    }

    if (scrollPosition > 86) {
      this.element.dataset.headerActive = true;
      if (scrollPosition < this.previousScrollY) {
        this.element.classList.remove(this.options.scroll);
      } else {
        this.element.classList.add(this.options.scroll);
      }
    } else {
      this.element.classList.remove(this.options.scroll);
      this.element.dataset.headerActive = false;
    }

    this.previousScrollY = scrollPosition;
  }

  /**
   * The map associating DOM element and detail page header instance.
   * @member DetailPageHeader.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode DetailPageHeader.create .create()}, or {@linkcode DetailPageHeader.init .init()},
   * properties in this object are overriden for the instance being created
   * and how {@linkcode DetailPageHeader.init .init()} works.
   * @member DetailPageHeader.options
   * @type {Object}
   * @property {string} selectorInit The CSS selector to find detail page headers.
   */
  static get options() {
    return defaultOptions(settings.prefix);
  }
}

export default DetailPageHeader;
