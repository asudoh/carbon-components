import trackFocusWithin from '../../../src/globals/js/misc/track-focus-within';

describe('Test tracking focus to see if focus is in an element', function() {
  let handle;
  let div;
  let inputOutside;

  beforeAll(function() {
    div = document.createElement('div');
    div.appendChild(document.createElement('input'));
    document.body.appendChild(div);
    inputOutside = document.createElement('input');
    document.body.appendChild(inputOutside);
  });

  beforeEach(function() {
    div.classList.remove('foo');
  });

  it('Should add/remove class depending on if the focus is in the given element', function() {
    handle = trackFocusWithin(div, 'foo');
    div.querySelector('input').focus();
    expect(div.classList.contains('foo')).toBe(true);
    inputOutside.focus();
    expect(div.classList.contains('foo')).toBe(false);
  });

  it('Should stop addding/removing class once the handle is released', function() {
    handle = trackFocusWithin(div, 'foo');
    handle.release();
    div.querySelector('input').focus();
    expect(div.classList.contains('foo')).toBe(false);
    div.classList.add('foo');
    inputOutside.focus();
    expect(div.classList.contains('foo')).toBe(true);
  });

  afterEach(function() {
    if (handle) {
      handle = handle.release();
    }
  });

  afterAll(function() {
    if (inputOutside) {
      inputOutside.parentNode.removeChild(inputOutside);
      inputOutside = null;
    }
    if (div) {
      div.parentNode.removeChild(div);
      div = null;
    }
  });
});
