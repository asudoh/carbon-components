import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByLauncher from '../../globals/js/mixins/init-component-by-launcher';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

const forEach = Array.prototype.forEach;

class PopupNav extends mixin(createComponent, initComponentByLauncher, handles) {
  /**
   * Pop-up navigation UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a pop-up navigation UI.
   * @param {Object} [options] The component options.
   */
  constructor(element, options) {
    super(element, options);
    this.manage(on(this.element, 'click', this._handleClick));
  }

  /**
   * A method that runs when `.init()` is called from `initComponentByLauncher`.
   */
  createdByLauncher() {
    this.changeState(!this.isExpanded() ? 'expanded' : 'collapsed');
  }

  /**
   * Handles click event.
   * @param {Event} evt The event triggering this action.
   */
  _handleClick = evt => {
    const categoryNode = eventMatches(evt, this.options.selectorCategory);
    const linkNode = eventMatches(evt, this.options.selectorLink);
    if (linkNode) {
      const itemNode = linkNode.closest(this.options.selectorItem);
      if (itemNode) {
        forEach.call(this.element.querySelectorAll(this.options.selectorItemActive), elem => {
          elem.classList.remove(this.options.classItemActive);
          elem.classList.remove(this.options.classCategoryItemActive);
        });
        if (itemNode.matches(this.options.selectorCategoryItem)) {
          itemNode.classList.add(this.options.classCategoryItemActive);
        } else {
          itemNode.classList.add(this.options.classItemActive);
        }
      }
    } else if (categoryNode) {
      categoryNode.classList.toggle(this.options.classCategoryExpanded);
    }
  };

  /**
   * @returns {boolean} `true` if this popup navigation UI is expanded.
   */
  isExpanded() {
    return !this.element.hasAttribute('hidden');
  }

  /**
   * Changes the expanded/collapsed state.
   * @param {string} state The new state.
   */
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
  static get options() {
    const { prefix } = settings;
    return {
      selectorInit: '[data-popup-nav]',
      selectorItem: `.${prefix}--navigation-item,.${prefix}--navigation__category-item`,
      selectorCategoryItem: `.${prefix}--navigation__category-item`,
      selectorItemActive: `.${prefix}--navigation-item--active,.${prefix}--navigation__category-item--active`,
      selectorCategory: `.${prefix}--navigation__category`,
      selectorLink: `.${prefix}--navigation-link`,
      classItemActive: `${prefix}--navigation-item--active`,
      classCategoryItemActive: `${prefix}--navigation__category-item--active`,
      classCategoryExpanded: `${prefix}--navigation__category--expanded`,
      attribInitTarget: 'data-popup-nav-target',
      initEventNames: ['click'],
    };
  }
}

export default PopupNav;
