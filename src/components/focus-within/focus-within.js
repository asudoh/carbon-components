import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import focusWithin from '../../globals/js/mixins/focus-within';

class FocusWithin extends mixin(createComponent, initComponentBySearch, focusWithin) {
  static components = new WeakMap();

  static options = {
    selectorInit: '[data-focus-within]',
    classFocusWithin: 'bx--label--disabled',
  };
}

export default FocusWithin;
