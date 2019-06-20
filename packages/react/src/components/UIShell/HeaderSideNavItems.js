/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';
import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import SideNavItems from './SideNavItems';

const { prefix } = settings;

const HeaderSideNavItems = ({
  className: customClassName,
  children,
  ...rest
}) => {
  const className = cx(
    `${prefix}--side-nav__header-navigation`,
    customClassName
  );
  return (
    <SideNavItems {...rest}>
      <div className={className}>{children}</div>
    </SideNavItems>
  );
};

HeaderSideNavItems.propTypes = {
  /**
   * Optionally provide a custom class name that is applied to the underlying
   * button
   */
  className: PropTypes.string,
};

export default HeaderSideNavItems;
