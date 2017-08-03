import on from '../misc/on';

export default function (ToMix) {
  class FocusWithin extends ToMix {
    /**
     * Mix-in class to add/remove class upon descendant of this component's root element getting/losing focus.
     * @param {HTMLElement} element The element working as this component.
     * @param {Object} [options] The component options.
     */
    constructor(element, options) {
      super(element, options);
      const hasFocusin = 'onfocusin' in this.element.ownerDocument.defaultView;
      const focusinEventName = hasFocusin ? 'focusin' : 'focus';
      this.hFocusIn = on(this.element.ownerDocument, focusinEventName, this.handleFocusIn, !hasFocusin);
    }

    /**
     * The method called when focus changes.
     */
    handleFocusIn = (event) => {
      if (typeof super.handleFocusIn === 'function') {
        super.handleFocusIn(event);
      }
      this.element.classList.toggle(this.options.classFocusWithin, this.element.contains(event.target));
    };

    release() {
      if (this.hFocusIn) {
        this.hFocusIn = this.hFocusIn.release();
      }
      super.release();
    }
  }

  return FocusWithin;
}
