import PropTypes from 'prop-types';
import React, { useState, useCallback, useRef } from 'react';
import HeaderMenu from './HeaderMenu';

/**
 * @param {object} props React props of a menu item.
 * @returns {object} The normalized data of the given menu item.
 */
const normalizeItem = ({ children, ...rest }) => ({
  content: children,
  ...rest,
});

/**
 * @param {object} props React props of a submenu.
 * @returns {object} The normalized data of the given submenu.
 */
const normalizeItems = ({ children, menuLinkName, ...rest }) => {
  return {
    items: React.Children.map(children, ({ type, props }) => {
      return type === HeaderMenu ? normalizeItems(props) : normalizeItem(props);
    }),
    content: menuLinkName,
    ...rest,
  };
};

const HeaderContainer = ({ isSideNavExpanded, render: Children }) => {
  const headerSideNavItemsRef = useRef();

  const [isSideNavExpandedState, setIsSideNavExpandedState] = useState(
    isSideNavExpanded
  );

  const [navChildren, setNavChildren] = useState();

  const handleHeaderMenuButtonClick = useCallback(() => {
    setIsSideNavExpandedState(!isSideNavExpandedState);
  }, [isSideNavExpandedState, setIsSideNavExpandedState]);

  const handleNavChildrenUpdate = useCallback(
    newNavChildren => {
      const navChildrenChanged =
        !navChildren ||
        !newNavChildren ||
        navChildren.length !== newNavChildren.length ||
        newNavChildren.some((item, i) => item !== navChildren[i]);
      if (navChildrenChanged) {
        setNavChildren(newNavChildren);
      }
    },
    [navChildren, setNavChildren]
  );

  return (
    <Children
      isSideNavExpanded={isSideNavExpandedState}
      navItems={navChildren && normalizeItems({ children: navChildren }).items}
      onClickSideNavExpand={handleHeaderMenuButtonClick}
      onNavChildrenUpdate={handleNavChildrenUpdate}
      headerSideNavItemsRef={headerSideNavItemsRef}
    />
  );
};

HeaderContainer.propTypes = {
  /**
   * Optionally provide a custom class name that is applied to the underlying <header>
   */
  isSideNavExpanded: PropTypes.bool,
};

HeaderContainer.defaultProps = {
  isSideNavExpanded: false,
};

export default HeaderContainer;
