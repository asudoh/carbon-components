export default function (ToMix) {
  /**
   * Mix-in class to instantiate components events on launcher button.
   * @class InitComponentByLauncher
   */
  class InitComponentByLauncher extends ToMix {
    /**
     * Instantiates this component in the given element.
     * If the given element indicates that it's an component of this class, instantiates it.
     * Otherwise, instantiates this component by clicking on launcher buttons
     * (buttons with attribute that `options.attribInitTarget` points to) of this component in the given node.
     * @param {Node} target The DOM node to instantiate this component in. Should be a document or an element.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorInit] The CSS selector to find this component.
     * @param {string} [options.attribInitTarget] The attribute name in the launcher buttons to find target component.
     * @returns {Handle} The handle to remove the event listener to handle clicking.
     */
    static init(target = document, options = {}) {
      const effectiveOptions = Object.assign(Object.create(this.options), options);
      if (target.nodeType !== Node.ELEMENT_NODE && target.nodeType !== Node.DOCUMENT_NODE) {
        throw new Error('DOM document or DOM element should be given to search for and initialize this widget.');
      }
      if (target.nodeType === Node.ELEMENT_NODE && target.matches(effectiveOptions.selectorInit)) {
        this.create(target, options);
      } else {
        let hInit = effectiveOptions.LauncherButtonClass.init(target, options);
        return {
          release() {
            if (hInit) {
              hInit = hInit.release();
            }
          },
        };
      }
      return '';
    }
  }
  return InitComponentByLauncher;
}
