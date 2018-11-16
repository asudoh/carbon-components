import PopupNavPanel from '../../src/components/ui-shell/popup-nav-panel';
import UiShellHtml from '../../html/ui-shell/ui-shell.html';

describe('Popup Nav', function() {
  describe('Constructor', function() {
    let popupNavPanel;

    it('Should throw if root element is not given', function() {
      expect(() => {
        popupNavPanel = new PopupNavPanel();
      }).toThrowError(TypeError, 'DOM element should be given to initialize this widget.');
    });

    it('Should throw if root element is not a DOM element', function() {
      expect(() => {
        popupNavPanel = new PopupNavPanel(document.createTextNode(''));
      }).toThrowError(TypeError, 'DOM element should be given to initialize this widget.');
    });

    afterEach(function() {
      if (popupNavPanel) {
        popupNavPanel = popupNavPanel.release();
      }
    });
  });

  describe('Init Component by Launch functionality', function() {
    let button;
    let popupNav;
    let context;
    let options;

    beforeAll(function() {
      const range = document.createRange();
      button = range.createContextualFragment(UiShellHtml).querySelector('[data-popup-nav-target]');
      popupNav = range.createContextualFragment(UiShellHtml).querySelector('[data-popup-nav]');
      document.body.appendChild(button);
      document.body.appendChild(popupNav);
      options = Object.assign(Object.create(PopupNavPanel.options), {
        selectorInit: '[data-popup-nav]',
        attribInitTarget: 'data-popup-nav-target',
        selectorShellNavSubmenu: '.bx--navigation__category-toggle',
        selectorShellNavLink: '.bx--navigation-link',
        selectorShellNavLinkCurrent: '.bx--navigation-item--active,.bx--navigation__category-item--active',
        selectorShellNavItem: '.bx--navigation-item',
        selectorShellNavCategory: '.bx--navigation__category',
        classShellNavItemActive: 'bx--navigation-item--active',
        classShellNavLinkCurrent: 'bx--navigation__category-item--active',
        classShellNavCategoryExpanded: 'bx--navigation__category--expanded',
      });
      context = PopupNavPanel.init(undefined, options);
    });

    beforeEach(function() {
      button.classList.remove('bx--header__action--active');
      popupNav.setAttribute('hidden', '');
    });

    it('Should open the popup nav on button click', function() {
      button.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(button.classList.contains('bx--header__action--active')).toBe(true);
      expect(popupNav.hasAttribute('hidden')).toBe(false);
    });

    it('Should close an open popup nav on button click', function() {
      popupNav.removeAttribute('hidden');
      button.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(button.classList.contains('bx--header__action--active')).toBe(false);
      expect(popupNav.hasAttribute('hidden')).toBe(true);
    });

    afterAll(function() {
      document.body.removeChild(button);
      document.body.removeChild(popupNav);
      context.release();
    });
  });
});
