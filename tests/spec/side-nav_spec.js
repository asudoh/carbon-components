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
});
