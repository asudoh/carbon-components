/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { settings } from 'carbon-components';

const { prefix } = settings;

const TableContainer = ({
  className,
  children,
  title,
  titleId,
  descriptionId,
  description,
  stickyHeader,
  ...rest
}) => {
  const tableContainerClasses = cx(
    className,
    `${prefix}--data-table-container`,
    {
      [`${prefix}--data-table--max-width`]: stickyHeader,
    }
  );

  return (
    <div {...rest} className={tableContainerClasses}>
      {title && (
        <div className={`${prefix}--data-table-header`}>
          <h4 id={titleId} className={`${prefix}--data-table-header__title`}>
            {title}
          </h4>
          <p
            id={descriptionId}
            className={`${prefix}--data-table-header__description`}>
            {description}
          </p>
        </div>
      )}
      {children}
    </div>
  );
};

TableContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  /**
   * Provide a title for the Table
   */
  title: PropTypes.node,

  /**
   * Provide an element ID of the title for the Table
   */
  titleId: PropTypes.string,

  /**
   * Provide an element ID of the description for the Table
   */
  descriptionId: PropTypes.string,

  /**
   * Optional description text for the Table
   */
  description: PropTypes.node,
};

export default TableContainer;
