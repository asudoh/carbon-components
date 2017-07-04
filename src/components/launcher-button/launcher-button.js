import mixin from '../../globals/js/misc/mixin';
import on from '../../globals/js/misc/on';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByEvent from '../../globals/js/mixins/init-component-by-event';

class LaucherButton extends mixin(createComponent, initComponentByEvent) {
  /**
   * Launcher button.
   * This class is *not* for direct use.
   * Instead, this class is for use by other components that are instantiated by a launcher button.
   * @extends CreateComponent
   * @extends InitComponentByEvent
   * @param {HTMLElement} element The element working as a launcher button.
   */
  constructor(element, options) {
    super(element, options);
    this.hClick = on(element, 'click', (event) => { this.launch(event); });
  }

  /**
   * A method called when this widget is created upon clicking.
   * @param {Event} evt The event triggering the creation.
   */
  createdByEvent(evt) {
    this.launch(evt);
  }

  /**
   * Instantiates component upon an event.
   * @param {Event} evt The event triggering this method.
   */
  launch(evt) {
    evt.delegateTarget = this.element; // eslint-disable-line no-param-reassign
    const elements = [...this.element.ownerDocument.querySelectorAll(this.element.getAttribute(this.options.attribInitTarget))];
    if (elements.length > 1) {
      throw new Error('Target widget must be unique.');
    }

    if (elements.length === 1) {
      if (this.element.tagName === 'A') {
        evt.preventDefault();
      }

      const component = this.options.ComponentToLaunch.create(elements[0], this.options);
      if (typeof component.createdByLauncher === 'function') {
        component.createdByLauncher(evt);
      }
    }
  }

  release() {
    if (this.hClick) {
      this.hClick = this.hClick.release();
    }
  }

  /**
   * The map associating DOM element and launcher button instance.
   * @member LaucherButton.components
   * @type {WeakMap}
   */
  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor, {@linkcode LaucherButton.create .create()},
   * or {@linkcode LaucherButton.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode LaucherButton.init .init()} works.
   * @member LaucherButton.options
   * @type {Object}
   * @property {string} selectorInit The CSS selector to find launcher buttons.
   * @property {string} attribInitTarget The attribute name in this launcher button to find target component.
   * @property {string[]} initEventNames The event name that this launcher button is instantiated with.
   */
  static options = {
    initEventNames: ['click'],
  };
}

export default LaucherButton;
