const attribNames = {
  htmlFor: 'for',
  className: 'class',
};

const eventNames = /^on/i;
const ignoredNames = /^(children|key|ref)$/i;

export default function createElement(ToMix) {
  /**
   * Mix-in class that defines a method to create DOM elements in the document the component is running on, with JSX interface.
   * @class CreateElement
   */
  class CreateElement extends ToMix {
    /**
     * Creates a DOM element with JSX interface.
     * @param {string} type The element type.
     * @param {Object<string, string|boolean>[]} [attribs] The attributes.
     * @param {...Node|string} [children] The child nodes.
     * @returns {Element} The DOM element created.
     */
    createElement(type, attribs, ...children) {
      const doc = this.element.ownerDocument;
      const elem = doc.createElement(type);
      if (attribs) {
        Object.keys(attribs).forEach(name => {
          if (eventNames.test(name)) {
            const messages = [
              `Setting event handler via JSX syntax, like ${name}, in vanilla carbon-components is not supported`,
              'The recommended way to hook event handlers on the elements created via JSX syntax' +
                ' is hooking on root element of the component and let the event bubble up.',
            ];
            throw new Error(messages.join('\n'));
          }
          if (ignoredNames.test(name)) {
            console.warn('Unsupported attribute name:', name); // eslint-disable-line no-console
          } else {
            const attribName = attribNames[name] || name;
            const value = attribs[name];
            // eslint-disable-next-line eqeqeq
            if (value == null || value === true) {
              // Boolean attribute or an empty value
              elem.setAttribute(attribName, '');
            } else if (name === 'style') {
              Object.assign(elem.style, value);
            } else if (typeof value !== 'boolean') {
              elem.setAttribute(attribName, value);
            }
          }
        });
      }
      const appendChild = child => {
        // https://reactjs.org/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored
        if (child != null && typeof child !== 'boolean') {
          elem.appendChild(child && typeof child.nodeType === 'number' ? child : doc.createTextNode(child));
        }
      };
      children.forEach(child => {
        if (Array.isArray(child)) {
          child.forEach(appendChild);
        } else {
          appendChild(child);
        }
      });
      return elem;
    }
  }
  return CreateElement;
}
