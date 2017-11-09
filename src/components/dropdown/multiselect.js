import eventMatches from '../../globals/js/misc/event-matches';
import Dropdown from './dropdown';

class MultiSelect extends Dropdown {
  /**
   * Dropdown box supporting multiple selections.
   * @extends Dropdown
   * @param {HTMLElement} element The element working as a selector.
   * @param {Object} [options] The component options.
   * @param {string} options.selectorInit The CSS selector to find the select boxes.
   * @param {string} [options.selectorList] The CSS selector to find the dropdown list.
   * @param {string} [options.selectorBadge] The CSS selector to find the badge.
   * @param {string} [options.selectorBadgeText] The CSS selector to find the badge text.
   * @param {string} [options.selectorItem] The CSS selector to find the dropdown items.
   * @param {string} [options.selectorCheckbox] The CSS selector to find the checkboxes.
   * @param {string} [options.selectorCheckboxChecked] The CSS selector to find the checkboxes that are checked.
   * @param {string} [options.classOpen] The CSS class for the open state.
   * @param {string} [options.classBadgeActive] The CSS class for the activated badge.
   * @param {string} [options.classItemHighlighted] The CSS class for the highlighted dropdown item.
   * @param {string} [options.eventAfterSelected]
   *   The name of the custom event fired after a drop down item is selected or unselected.
   */
  constructor(element, options) {
    super(element, options);
    this._handleSelection();
    this.element.addEventListener('click', this._handleBadgeClick);
  }

  /**
   * The index of the highlighted menu item.
   * @type {number}
   */
  _highlightedIndex = -1;

  /**
   * Handles an event clicking on the badge.
   * @param {Event} evt The event triggering this method.
   */
  _handleBadgeClick = evt => {
    if (eventMatches(evt, this.options.selectorBadge)) {
      [...this.element.querySelectorAll(this.options.selectorCheckboxChecked)].forEach(elem => {
        elem.checked = false;
      });
      this._handleSelection();
      this.element.focus(); // Prevent focus from being orphaned by clear button being hidden
    }
  };

  /**
   * Handles keydown event.
   * @param {Event} evt The event triggering this method.
   */
  _handleKeyDown = evt => {
    const checkboxForHighlighted = this.element.querySelectorAll(this.options.selectorCheckbox)[this._highlightedIndex];
    // Handles enter key in addition to space key
    if (checkboxForHighlighted && evt.which === 13) {
      checkboxForHighlighted.checked = !checkboxForHighlighted.checked;
      this._handleSelection();
    } else {
      super._handleKeyDown(evt);
    }
  };

  /**
   * Opens and closes the dropdown menu.
   * @param {Event} [evt] The event triggering this method.
   */
  _toggle = evt => {
    // Let ESC key close the dropdown even if the event came from checkbox or clear button
    if (
      !this.element.contains(evt.target) ||
      evt.which === 27 ||
      (!eventMatches(evt, this.options.selectorList) && !eventMatches(evt, this.options.selectorBadge))
    ) {
      const wasOpen = this.element.classList.contains(this.options.classOpen);
      super._toggle(evt);
      const isOpen = this.element.classList.contains(this.options.classOpen);
      if (wasOpen && !isOpen) {
        this.setCurrentNavigation(null);
      }
    }
  };

  /**
   * @returns {Element} Currently highlighted element.
   */
  getCurrentNavigation() {
    return this.element.querySelectorAll(this.options.selectorItem)[this._highlightedIndex];
  }

  /**
   * Sets the currently highlighted element.
   * @param {Element} element The currently highlighted element.
   */
  setCurrentNavigation(element) {
    const items = [...this.element.querySelectorAll(this.options.selectorItem)];
    this._highlightedIndex = -1;
    items.forEach((item, i) => {
      const matches = item === element;
      item.classList.toggle(this.options.classItemHighlighted, matches);
      if (matches) {
        const origFocus = this.element.ownerDocument.activeElement;
        this._highlightedIndex = i;
        element.focus(); // A trick to move the highlighted item into view
        if (this.element.contains(origFocus)) {
          origFocus.focus();
        }
      }
    });
  }

  /**
   * Handles clicking on the dropdown item.
   * @param {Element} element The element to be activated.
   */
  select(element) {
    const checkbox = element.querySelector(this.options.selectorCheckbox);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      this._handleSelection();
    }
  }

  /**
   * Updates the badge and the button to clear selections upon change in selection.
   */
  _handleSelection = () => {
    const badge = this.element.querySelector(this.options.selectorBadge);
    const badgeText = this.element.querySelector(this.options.selectorBadgeText);
    const selected = [...this.element.querySelectorAll(this.options.selectorCheckboxChecked)];
    const selectedCount = selected.length;
    if (badgeText) {
      badgeText.textContent = selectedCount;
    }
    if (badge) {
      badge.classList.toggle(this.options.classBadgeActive, selectedCount > 0);
    }
    this.element.dispatchEvent(
      new CustomEvent(this.options.eventAfterSelected, {
        bubbles: true,
        cancelable: true,
        detail: {
          selected: selected.map(elem => elem.value),
        },
      })
    );
  };

  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode MultiSelect.create .create()}, or {@linkcode MultiSelect.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode MultiSelect.init .init()} works.
   * @member MultiSelect.options
   * @type {Object}
   * @property {string} selectorInit The CSS selector to find the select boxes.
   * @property {string} [selectorList] The CSS selector to find the dropdown list.
   * @property {string} [selectorBadge] The CSS selector to find the badge.
   * @property {string} [selectorBadgeText] The CSS selector to find the badge text.
   * @property {string} [selectorItem] The CSS selector to find the dropdown items.
   * @property {string} [selectorCheckbox] The CSS selector to find the checkboxes.
   * @property {string} [selectorCheckboxChecked] The CSS selector to find the checkboxes that are checked.
   * @property {string} [classOpen] The CSS class for the open state.
   * @property {string} [classBadgeActive] The CSS class for the activated badge.
   * @property {string} [classItemHighlighted] The CSS class for the highlighted dropdown item.
   * @property {string} [eventAfterSelected] The name of the custom event fired after a drop down item is selected or unselected.
   */
  static options = Object.assign(Object.create(Dropdown.options), {
    selectorInit: '[data-multiselect]',
    selectorList: '.bx--list-box__menu',
    selectorBadge: '.bx--list-box__badge',
    selectorBadgeText: '.bx--list-box__badge-text',
    selectorCheckbox: '.bx--checkbox',
    selectorCheckboxChecked: '.bx--checkbox:checked',
    selectorItem: '.bx--list-box__menu-item',
    classOpen: 'bx--list-box--open',
    classBadgeActive: 'bx--list-box__badge--active',
    classItemHighlighted: 'bx--list-box__menu-item--highlighted',
    eventAfterSelected: 'multiselect-selected',
  });
}

export default MultiSelect;
