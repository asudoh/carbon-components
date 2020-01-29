/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import throttle from 'lodash.throttle';
import React, { useCallback, useRef } from 'react';

import { settings } from 'carbon-components';
const { prefix } = settings;

// resizer component within table header

const TableColumnResizer = ({ onDragStart, onDrag, onDrop, ...rest }) => {
  const resizeHandle = useRef(null);
  const dragTarget = useRef(null);
  const dragPosition = useRef();

  const doResizing = useCallback(
    ev => {
      // prevent other mouse actions like text selection
      ev.stopPropagation();
      ev.preventDefault();
      // `dragPosition.current` is the last `ev.pageX` recorded at `startResizing()` and `doResizing()`
      const diff = ev.pageX - dragPosition.current;
      if (diff !== 0) {
        const { current: th } = dragTarget; // `ev.target.closest(th[scope="col"])` at `startResizing()`
        const tr = th.closest('tr'); // The table header row
        const restThs = Array.prototype.filter.call(
          tr.querySelectorAll('th[scope="col"]'),
          elem => elem !== th
        );
        const restThsLength = restThs.length;
        const restDiff = Math.floor(diff / restThsLength);
        const restDiffMod = diff % restThsLength;
        const { width } = th.getBoundingClientRect();
        // Equally distributes to the compensation of the size change to the rest of the columns.
        // Need to discuss with our design team on this.
        const restWidths = restThs.map((elem, index) => {
          const { width: itemWidth } = elem.getBoundingClientRect();
          return itemWidth - restDiff - (index < restDiffMod ? 1 : 0);
        });
        th.style.width = `${width + diff}px`;
        restThs.forEach((elem, index) => {
          elem.style.width = restWidths[index];
        });
        if (onDrag) {
          onDrag({ th, position: dragPosition.current });
        }
      }
      // Keeps track of the last `ev.pageX`
      dragPosition.current = ev.pageX;
    },
    [onDrag]
  );

  const throttledDoResizing = throttle(doResizing, 50);

  const endResizing = useCallback(() => {
    document.removeEventListener('mouseup', endResizing);
    document.removeEventListener('mousemove', doResizing);
    document.body.style.cursor = 'default';
    const { current: th } = dragTarget;
    const resizer = th.querySelector(`.${prefix}--table-header-resizer`);
    if (resizer) {
      resizer.classList.remove(`${prefix}--table-header-resizer-active`);
    }
    const tr = th.closest('tr'); // The table header row
    const restThs = Array.prototype.filter.call(
      tr.querySelectorAll('th[scope="col"]'),
      elem => elem !== th
    );
    restThs.forEach(elem => {
      elem
        .querySelector(`.${prefix}--table-header-resizer`)
        .classList.remove(`${prefix}--table-header-resizer-passive`);
    });
    const lastPosition = dragPosition.current;
    dragPosition.current = undefined;
    dragTarget.current = null;
    if (onDrop) {
      onDrop({ th, position: lastPosition });
    }
  }, [doResizing, onDrop]);

  const startResizing = useCallback(
    ev => {
      ev.target.classList.add(`${prefix}--table-header-resizer-active`);
      const th = ev.target.closest('th[scope="col"]');
      const tr = th.closest('tr'); // The table header row
      const restThs = Array.prototype.filter.call(
        tr.querySelectorAll('th[scope="col"]'),
        elem => elem !== th
      );
      restThs.forEach(elem => {
        elem
          .querySelector(`.${prefix}--table-header-resizer`)
          .classList.add(`${prefix}--table-header-resizer-passive`);
      });
      dragTarget.current = th;
      dragPosition.current = ev.pageX;
      document.addEventListener('mouseup', endResizing);
      document.addEventListener('mousemove', throttledDoResizing);
      // keep cursor style everywhere during resizing
      document.body.style.cursor = 'col-resize';
      if (onDragStart) {
        onDragStart({ th, position: dragPosition.current });
      }
    },
    [throttledDoResizing, endResizing, onDragStart]
  );

  return (
    <div
      ref={resizeHandle}
      className={`${prefix}--table-header-resizer`}
      onMouseDown={startResizing}
      role="separator"
      {...rest}
    />
  );
};

TableColumnResizer.displayName = 'TableColumnResizer';

export default TableColumnResizer;
