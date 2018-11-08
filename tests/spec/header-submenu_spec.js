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

  describe('Toggle', function() {
    let headerSubmenu;
    let element;
    let triggerNode;
    let itemLinkNode;

    beforeAll(function() {
      element = document.createElement('li');
      triggerNode = document.createElement('a');
      triggerNode.className = 'bx--header__menu-title';
      element.appendChild(triggerNode);
      const itemsContainerNode = document.createElement('bx--header__menu');
      itemsContainerNode.className = 'bx--header__menu';
      const itemNode = document.createElement('li');
      itemLinkNode = document.createElement('a');
      itemLinkNode.className = 'bx--header__menu-item';
      itemNode.appendChild(itemLinkNode);
      itemsContainerNode.appendChild(itemNode);
      element.appendChild(itemsContainerNode);
      headerSubmenu = new HeaderSubmenu(element);
      document.body.appendChild(element);
    });

    it('Should add "open" stateful modifier class', function() {
      element.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(triggerNode.getAttribute('aria-expanded')).toBe('true');
    });

    it('Should remove "open" stateful modifier class (closed default state)', function() {
      triggerNode.setAttribute('aria-expanded', 'true');
      element.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(triggerNode.getAttribute('aria-expanded')).toBe('false');
    });

    it('Should always close dropdown when clicking document', function() {
      triggerNode.setAttribute('aria-expanded', 'true');
      document.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(triggerNode.getAttribute('aria-expanded')).toBe('false');
    });

    it('Should close dropdown when clicking on an item', function() {
      triggerNode.setAttribute('aria-expanded', 'true');
      element.classList.add('bx--dropdown--open');
      itemLinkNode.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(triggerNode.getAttribute('aria-expanded')).toBe('false');
    });

    afterEach(function() {
      triggerNode.setAttribute('aria-expanded', 'false');
    });

    afterAll(function() {
      headerSubmenu.release();
      document.body.removeChild(element);
    });
  });
});
