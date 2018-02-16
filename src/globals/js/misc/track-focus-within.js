import on from './on';

/**
 * Tracks keyboard focus and sets/removes the given CSS class if the keyboard focus is in the given DOM element.
 * @param {Element} elem The DOM element to track keyboard focus within.
 * @param {string} classFocus The CSS class to add when the keyboard focus is in the given DOM element.
 * @returns {Handle} The handle to clean up the event listeners.
 */
export default function trackFocusWithin(elem, classFocus) {
  const handles = new Set();
  const doc = elem.ownerDocument;
  const w = doc.defaultView;
  const hasFocusin = 'onfocusin' in w;
  const focusinEventName = hasFocusin ? 'focusin' : 'focus';
  handles.add(
    on(
      doc,
      focusinEventName,
      evt => {
        elem.classList.toggle(classFocus, elem.contains(evt.target));
      },
      !hasFocusin
    )
  );
  handles.add(
    on(doc.defaultView, 'blur', () => {
      elem.classList.remove(classFocus);
    })
  );
  return {
    release() {
      handles.forEach(handle => {
        handle.release();
        handles.delete(handle);
      });
      return null;
    },
  };
}
