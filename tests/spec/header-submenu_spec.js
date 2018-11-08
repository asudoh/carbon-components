import HeaderSubmenu from '../../src/components/ui-shell/header-submenu';

describe('HeaderSubmenu', function() {
  describe('Constructor', function() {
    it('Should throw if root element is not given', function() {
      expect(() => {
        new HeaderSubmenu();
      }).toThrowError(TypeError, 'DOM element should be given to initialize this widget.');
    });

    it('Should throw if root element is not a DOM element', function() {
      expect(() => {
        new HeaderSubmenu(document.createTextNode(''));
      }).toThrowError(TypeError, 'DOM element should be given to initialize this widget.');
    });
  });

  describe('Managing instances: create() and release()', function() {
    let element;

    beforeAll(function() {
      element = document.createElement('li');
      const triggerNode = document.createElement('a');
      triggerNode.className = 'bx--header__menu-title';
      element.appendChild(triggerNode);
    });

    it('Should prevent creating duplicate instances', function() {
      let first;
      let second;
      try {
        first = HeaderSubmenu.create(element);
        second = HeaderSubmenu.create(element);
        expect(first).toBe(second);
      } finally {
        first && first.release();
        if (first !== second) {
          second && second.release();
        }
      }
    });

    it('Should create a new instance for an element if an earlier one has been released', function() {
      let first;
      let second;
      try {
        first = HeaderSubmenu.create(element);
        first.release();
        second = HeaderSubmenu.create(element);
        expect(first).not.toBe(second);
      } finally {
        first && first.release();
        if (first !== second) {
          second && second.release();
        }
      }
    });

    it('Should remove click event listener on document object once the instance is released', function() {
      element.classList.add('bx--dropdown--open');
      document.body.appendChild(element);
      HeaderSubmenu.create(element).release();
      document.body.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(element.querySelector('.bx--header__menu-title').getAttribute('aria-expanded')).not.toBe('true');
    });

    afterEach(function() {
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  });
});
