import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import eventedState from '../../globals/js/mixins/evented-state';

/**
 * Collapsible element.
 * @class CollapsibleElement
 * @extends CreateComponent
 * @extends EventedState
 * @param {HTMLElement} element The element working as a collapsible element.
 * @param {Object} [options] The component options.
 * @param {Element} [options.stateNode]
 *   The element that the CSS classes representing expanded/transient/collapsed states should be applied.
 * @param {string} [options.classExpanded] The CSS class for the expanded state.
 * @param {string} [options.classTransientStart] The CSS class for the initial transient state.
 * @param {string} [options.classTransientEnd] The CSS class for the target transient state.
 * @param {string} [options.classCollapsed] The CSS class for the collapsed state.
 */
class CollapsibleElement extends mixin(createComponent, eventedState) {
  /**
   * Changes the expanded/collapsed state.
   * @private
   * @param {string} state The new state.
   * @param {Object} detail The detail of the event trigging this action.
   * @param {Function} callback Callback called when change in state completes.
   */
  _changeState(state, detail, callback) {
    const element = this.element;
    const stateNode = this.options.stateNode || element;
    const expanded = state === 'expanded';
    const w = element.ownerDocument.defaultView;

    const classTransientStart = this.options.classTransientStart;
    const classTransientEnd = this.options.classTransientEnd;
    const classExpanded = this.options.classExpanded;
    const classCollapsed = this.options.classCollapsed;

    const transitionEnd = () => {
      element.removeEventListener('transitionend', transitionEnd);
      if (classExpanded) {
        stateNode.classList.toggle(classExpanded, expanded);
      }
      if (this.options.classCollapsed) {
        stateNode.classList.toggle(classCollapsed, !expanded);
      }
      if (classTransientStart) {
        stateNode.classList.remove(classTransientStart);
      }
      element.style.height = '';
      callback();
    };

    w.requestAnimationFrame(() => {
      if (classTransientStart) {
        stateNode.classList.add(classTransientStart);
      }
      const height = this.element.scrollHeight;
      element.style.height = expanded ? '0px' : `${height}px`;

      w.requestAnimationFrame(() => {
        if (classTransientEnd) {
          stateNode.classList.add(classTransientEnd);
        }
        element.style.height = expanded ? `${height}px` : '0px';
        element.addEventListener('transitionend', transitionEnd);
      });
    });
  }

  static components = new WeakMap();

  /**
   * The component options.
   * If `options` is specified in the constructor, {@linkcode CollapsibleElement.create .create()},
   * properties in this object are overriden for the instance being created.
   * @member CollapsibleElement.options
   * @property {string} [eventBeforeExpanded]
   *   The name of the custom event fired before this element is expanded.
   *   Cancellation of this event stops showing the element.
   * @property {string} [eventAfterExpanded]
   *   The name of the custom event telling that this element is sure expanded
   *   without being canceled by the event handler named by `eventBeforeExpanded` option (`collapsible-element-beingexpanded`).
   * @property {string} [eventBeforeCollapsed]
   *   The name of the custom event fired before this element is collapsed.
   *   Cancellation of this event stops hiding the element.
   * @property {string} [eventAfterCollapsed]
   *   The name of the custom event telling that this element is sure collapsed
   *   without being canceled by the event handler named by `eventBeforeCollapsed` option (`collapsible-element-beingcollapsed`).
   */
  static options = {
    eventBeforeExpanded: 'collapsible-element-beingexpanded',
    eventAfterExpanded: 'collapsible-element-expanded',
    eventBeforeCollapsed: 'collapsible-element-beingcollapsed',
    eventAfterCollapsed: 'collapsible-element-collapsed',
  };
}

export default CollapsibleElement;
