import eventMatches from '../../globals/js/misc/event-matches';
import Dropdown from './dropdown';

class Combobox extends Dropdown {
  /**
   * Dropdown box supporting multiple selections.
   * @extends Dropdown
   * @param {HTMLElement} element The element working as a selector.
   * @param {Object} [options] The component options.
   * @param {string} options.selectorInit The CSS selector to find comboboxes.
   * @param {string} [options.selectorList] The CSS selector to find the dropdown list.
   * @param {string} [options.selectorBadge] The CSS selector to find the badge.
   * @param {string} [options.selectorClearButton] The CSS selector to find the button to clear selections.
   * @param {string} [options.selectorCheckbox] The CSS selector to find the checkboxes.
   * @param {string} [options.selectorCheckboxChecked] The CSS selector to find the checkboxes that are checked.
   * @param {string} [options.classBadgeActive] The CSS class for the activated badge.
   * @param {string} [options.classClearButtonActive] The CSS class for the activated button to clear selections.
   * @param {string} [options.eventAfterSelected]
   *   The name of the custom event fired after a drop down item is selected or unselected.
   */
  constructor(element, options) {
    super(element, options);
    this.handleSelection();
    this.element.addEventListener('click', this._handleClearButton);
    this.element.addEventListener('change', this.handleSelection);
  }

  /**
   * Handles an event on the clear selection button.
   * @param {Event} evt The event triggering this method.
   */
  _handleClearButton = evt => {
    if (eventMatches(evt, this.options.selectorClearButton)) {
      [...this.element.querySelectorAll(this.options.selectorCheckboxChecked)].forEach(elem => {
        elem.checked = false;
      });
      this.handleSelection();
      this.element.focus(); // Prevent focus from being orphaned by clear button being hidden
    }
  };

  /**
   * Handles keydown event.
   * @param {Event} evt The event triggering this method.
   */
  _handleKeyDown = evt => {
    const checkbox = this.element.contains(evt.target) && eventMatches(evt, this.options.selectorCheckbox);
    // Handles enter key in addition to space key
    if (checkbox && evt.which === 13) {
      checkbox.checked = !checkbox.checked;
      this.handleSelection();
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
      !this.element.contains(event.target) ||
      evt.which === 27 ||
      (!eventMatches(evt, this.options.selectorList) && !eventMatches(evt, this.options.selectorClearButton))
    ) {
      super._toggle(evt);
    }
  };

  /**
   * Updates the badge and the button to clear selections upon change in selection.
   */
  handleSelection = () => {
    const badge = this.element.querySelector(this.options.selectorBadge);
    const clearButton = this.element.querySelector(this.options.selectorClearButton);
    const selected = [...this.element.querySelectorAll(this.options.selectorCheckboxChecked)];
    const selectedCount = selected.length;
    if (badge) {
      badge.textContent = selectedCount;
      badge.classList.toggle(this.options.classBadgeActive, selectedCount > 0);
    }
    if (clearButton) {
      clearButton.classList.toggle(this.options.classClearButtonActive, selectedCount > 0);
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
   * If `options` is specified in the constructor, {@linkcode Combobox.create .create()}, or {@linkcode Combobox.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode Combobox.init .init()} works.
   * @member Combobox.options
   * @type {Object}
   * @property {string} selectorInit The CSS selector to find comboboxes.
   * @property {string} [selectorList] The CSS selector to find the dropdown list.
   * @property {string} [selectorBadge] The CSS selector to find the badge.
   * @property {string} [selectorClearButton] The CSS selector to find the button to clear selections.
   * @property {string} [selectorCheckbox] The CSS selector to find the checkboxes.
   * @property {string} [selectorCheckboxChecked] The CSS selector to find the checkboxes that are checked.
   * @property {string} [classBadgeActive] The CSS class for the activated badge.
   * @property {string} [classClearButtonActive] The CSS class for the activated button to clear selections.
   * @property {string} [eventAfterSelected] The name of the custom event fired after a drop down item is selected or unselected.
   */
  static options = Object.assign(Object.create(Dropdown.options), {
    selectorInit: '[data-combobox]',
    selectorList: '.bx--dropdown-list',
    selectorBadge: '.bx--combobox__badge',
    selectorClearButton: '.bx--combobox__clear',
    selectorCheckbox: '.bx--checkbox',
    selectorCheckboxChecked: '.bx--checkbox:checked',
    classBadgeActive: 'bx--combobox__badge--active',
    classClearButtonActive: 'bx--combobox__clear--active',
    eventAfterSelected: 'combobox-selected',
  });
}

export default Combobox;
