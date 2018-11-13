import SideNav from '../../src/components/ui-shell/side-nav';

describe('Side Nav', function() {
  describe('Constructor', function() {
    it('Should throw if root element is not given', function() {
      expect(() => new SideNav()).toThrowError(TypeError, 'DOM element should be given to initialize this widget.');
    });

    it('Should throw if root element is not a DOM element', function() {
      expect(() => new SideNav(document.createTextNode(''))).toThrowError(
        TypeError,
        'DOM element should be given to initialize this widget.'
      );
    });
  });

  describe('Click handler', function() {
    let element;
    let toggleNode;
    let navLinkNode;
    let navSubmenuNode;
    let navSubmenuTriggerNode;
    let sideNav;

    beforeAll(function() {
      element = document.createElement('aside');
      toggleNode = document.createElement('button');
      toggleNode.className = 'bx--side-nav__submenu';
      navLinkNode = document.createElement('li');
      navLinkNode.className = 'bx--side-nav__item';
      navSubmenuNode = document.createElement('li');
      navSubmenuNode.className = 'bx--side-nav__item';
      navSubmenuTriggerNode = document.createElement('button');
      navSubmenuTriggerNode.className = 'bx--side-nav__submenu';
      navSubmenuNode.appendChild(navSubmenuTriggerNode);
      element.appendChild(navLinkNode);
      element.appendChild(navSubmenuNode);
      element.appendChild(toggleNode);
      sideNav = new SideNav(element);
      document.body.appendChild(element);
    });

    describe('Click toggle', function() {
      it('should open the side nav on toggle click', function() {
        toggleNode.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        expect(toggleNode.getAttribute('aria-expanded')).toBe('true');
      });

      it('should close the open side nav on toggle click', function() {
        toggleNode.setAttribute('aria-expanded', 'true');
        toggleNode.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        expect(toggleNode.getAttribute('aria-expanded')).toBe('false');
      });
    });

    afterEach(function() {
      toggleNode.setAttribute('aria-expanded', 'false');
      navSubmenuTriggerNode.setAttribute('aria-expanded', 'false');
    });

    afterAll(function() {
      sideNav.release();
      document.body.removeChild(element);
    });
  });
});
