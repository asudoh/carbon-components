/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useCallback } from 'react';
import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { AriaLabelPropType } from '../../prop-types/AriaPropTypes';
import SideNavFooter from './SideNavFooter';

const { prefix } = settings;

const SideNav = React.forwardRef(function SideNav(props, ref) {
  const {
    isExpanded: isExpandedProp,
    defaultIsExpanded,
    isChildOfHeader,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children,
    onToggle,
    className: customClassName,
    translateById: t,
  } = props;

  const [isExpandedState, setIsExpandedState] = useState(defaultIsExpanded);
  const handleToggle = useCallback(
    (
      evt,
      {
        isExpanded = typeof isExpandedProp === 'undefined'
          ? !isExpandedState
          : !isExpandedProp,
      } = {}
    ) => {
      if (typeof isExpandedProp === 'undefined') {
        setIsExpandedState(isExpanded);
      }
      if (onToggle) {
        onToggle(evt, { isExpanded: isExpanded });
      }
    },
    [isExpandedState, setIsExpandedState, isExpandedProp, onToggle]
  );

  const handleOnFocus = useCallback(
    evt => handleToggle(evt, { isExpanded: true }),
    [isExpandedState, setIsExpandedState, isExpandedProp, onToggle]
  );
  const handleOnBlur = useCallback(
    evt => handleToggle(evt, { isExpanded: false }),
    [isExpandedState, setIsExpandedState, isExpandedProp, onToggle]
  );

  const isExpanded =
    typeof isExpandedProp === 'undefined' ? isExpandedState : isExpandedProp;

  const accessibilityLabel = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  };

  const assistiveText = isExpanded
    ? t('carbon.sidenav.state.open')
    : t('carbon.sidenav.state.closed');

  const className = cx({
    [`${prefix}--side-nav`]: true,
    [`${prefix}--side-nav--expanded`]: isExpanded,
    [customClassName]: !!customClassName,
    [`${prefix}--side-nav--ux`]: isChildOfHeader,
  });

  return (
    <nav
      ref={ref}
      className={`${prefix}--side-nav__navigation ${className}`}
      {...accessibilityLabel}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}>
      {children}
      <SideNavFooter
        assistiveText={assistiveText}
        isExpanded={isExpanded}
        onToggle={handleToggle}
      />
    </nav>
  );
});

SideNav.defaultProps = {
  translateById: id => {
    const translations = {
      'carbon.sidenav.state.open': 'Close',
      'carbon.sidenav.state.closed': 'Open',
    };
    return translations[id];
  },
  defaultIsExpanded: false,
  isChildOfHeader: true,
};

SideNav.propTypes = {
  /**
   * If `true`, the SideNav will be expanded, otherwise it will be collapsed.
   * Using this prop causes SideNav to become a controled component.
   */
  isExpanded: PropTypes.bool,

  /**
   * If `true`, the SideNav will be open on initial render.
   */
  defaultIsExpanded: PropTypes.bool,

  /**
   * An optional listener that is called when an event that would cause
   * toggling the SideNav occurs.
   *
   * @param {object} event
   * @param {boolean} value
   */
  onToggle: PropTypes.func,

  /**
   * Required props for accessibility label on the underlying menu
   */
  ...AriaLabelPropType,

  /**
   * Optionally provide a custom class to apply to the underlying <li> node
   */
  className: PropTypes.string,

  /**
   * Provide a custom function for translating all message ids within this
   * component. This function will take in two arguments: the mesasge Id and the
   * state of the component. From this, you should return a string representing
   * the label you want displayed or read by screen readers.
   */
  translateById: PropTypes.func,
  /**
   * Specify is SideNav is being used with Header
   */
  isChildOfHeader: PropTypes.bool,
};

export default SideNav;
