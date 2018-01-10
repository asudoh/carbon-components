import eventMatches from '../../src/globals/js/misc/event-matches';
import { InteriorLeftNav } from '../../src';

document.body.addEventListener('click', (evt) => {
  const btnNode = eventMatches(evt, '.side-nav__toggle-btn');
  if (btnNode) {
    btnNode.classList.toggle('side-nav__toggle-btn--closed');
    const containerNode = document.querySelector('.container');
    if (containerNode) {
      containerNode.classList.toggle('container--expanded');
    }
    if (btnNode) {
      const leftNavNode = document.querySelector('[data-interior-left-nav]');
      const leftNav = leftNavNode && InteriorLeftNav.create(leftNavNode);
      if (leftNav) {
        leftNav.toggleLeftNav();
      }
    }
  }
});
