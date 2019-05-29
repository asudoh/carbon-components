import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * State manager for side nav in UI shell header.
 */
const HeaderContainer = ({
  defaultIsSideNavExpanded,
  isSideNavExpanded,
  onToggleSideNav,
  render: Children,
}) => {
  const [isSideNavExpandedState, setIsSideNavExpandedState] = useState(
    defaultIsSideNavExpanded
  );
  const handleToggleSideNav = useCallback(
    (
      evt,
      {
        isExpanded = typeof isSideNavExpanded === 'undefined'
          ? !isSideNavExpandedState
          : !isSideNavExpanded,
      } = {}
    ) => {
      if (typeof isSideNavExpanded === 'undefined') {
        setIsSideNavExpandedState(isExpanded);
      }
      if (onToggleSideNav) {
        onToggleSideNav(evt, { isSideNavExpanded: isExpanded });
      }
    },
    [
      isSideNavExpandedState,
      setIsSideNavExpandedState,
      isSideNavExpanded,
      onToggleSideNav,
    ]
  );
  return (
    <Children
      isSideNavExpanded={
        typeof isSideNavExpanded !== 'undefined'
          ? isSideNavExpanded
          : isSideNavExpandedState
      }
      onToggleSideNav={handleToggleSideNav}
    />
  );
};

HeaderContainer.propTypes = {
  /**
   * If `true`, the SideNav will be expanded, otherwise it will be collapsed.
   * Using this prop causes SideNav to become a controled component.
   */
  isSideNavExpanded: PropTypes.bool,

  /**
   * If `true`, the SideNav will be open on initial render.
   */
  defaultIsSideNavExpanded: PropTypes.bool,

  /**
   * An optional listener that is called when an event that would cause
   * toggling the SideNav occurs.
   */
  onToggleSideNav: PropTypes.func,

  /**
   * The callback to render the contents.
   */
  render: PropTypes.func.isRequired,
};

export default HeaderContainer;
