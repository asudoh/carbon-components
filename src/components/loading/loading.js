import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';
import defaultOptions from './options';

class Loading extends mixin(createComponent, initComponentBySearch, handles) {
  /**
   * Spinner indicating loading state.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a spinner.
   * @param {Object} [options] The component options.
   * @param {boolean} [options.active] `true` if this spinner should roll.
   */
  constructor(element, options) {
    super(element, options);

    this.active = this.options.active;

    // Initialize spinner
    this.set(this.active);
  }

  /**
   * Sets active/inactive state.
   * @param {boolean} active `true` if this spinner should roll.
   */
  set(active) {
    if (typeof active !== 'boolean') {
      throw new TypeError('set expects a boolean.');
    }

    this.active = active;
    this.element.classList.toggle(this.options.classLoadingStop, !this.active);

    /**
     * If overlay is the parentNode then toggle it too.
     */
    const parentNode = this.element.parentNode;

    if (parentNode && parentNode.classList.contains(this.options.classLoadingOverlay)) {
      parentNode.classList.toggle(this.options.classLoadingOverlayStop, !this.active);
    }

    return this;
  }

  /**
   * Toggles active/inactive state.
   * @param {boolean} active `true` if this spinner should roll.
   */
  toggle() {
    return this.set(!this.active);
  }

  /**
   * @returns {boolean} `true` if this spinner is rolling.
   */
  isActive() {
    return this.active;
  }

  /**
   * Sets state to inactive and deletes the loading element.
   */
  end() {
    this.set(false);
    let handleAnimationEnd = this.manage(
      on(this.element, 'animationend', evt => {
        if (handleAnimationEnd) {
          handleAnimationEnd = this.unmanage(handleAnimationEnd).release();
        }
        if (evt.animationName === 'rotate-end-p2') {
          this._deleteElement();
        }
      })
    );
  }

  /**
   * Delete component from the DOM.
   */
  _deleteElement() {
    const parentNode = this.element.parentNode;

    parentNode.removeChild(this.element);

    if (parentNode.classList.contains(this.options.selectorLoadingOverlay)) {
      parentNode.remove();
    }
  }

  /**
   * The map associating DOM element and spinner instance.
   * @member Loading.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor, {@linkcode Loading.create .create()}, or {@linkcode Loading.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode Loading.init .init()} works.
   * @member Loading.options
   * @type {Object}
   * @property {string} selectorInit The CSS selector to find spinners.
   */
  static get options() {
    return defaultOptions(settings.prefix);
  }
}

export default Loading;
