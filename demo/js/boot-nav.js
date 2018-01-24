import 'core-js/modules/es6.array.find';

import React from 'react';
import ReactDOM from 'react-dom';
import { RootPage } from 'carbon-addons-website';

/**
 * @typedef {Object} NormalizedVariant The normalized variant of component variant metadata.
 * @property {string} id The unique ID.
 * @property {string} name The component name.
 * @property {string} label The displayed name of the component.
 * @property {string} content The code snippet.
 */

/**
 * @typedef {Object} NormalizedComponent The normalized version of component metadata.
 * @property {string} id The unique ID.
 * @property {string} name The component name.
 * @property {string} label The displayed name of the component.
 * @property {string} notes The documentation.
 * @property {string} [content] The code snippet.
 * @property {NormalizedVariant[]} [items] The list of metadata of component variants.
 */

/**
 * @param {ComponentCollection|Component} metadata The component data.
 * @returns {string} The HTML snippet for the component.
 */
const getContent = metadata => {
  const { variants = {} } = metadata;
  const { items = [] } = variants;
  const variant = items[0];
  return metadata.content || (variant && variant.content) || '';
};

/**
 * @param {ComponentCollection|Component} metadata The component data.
 * @returns {Component[]|Variant[]} The data of the component variants.
 */
const getVariants = metadata => {
  if (metadata.isCollection) {
    return metadata.items;
  }
  if (!metadata.isCollated) {
    return metadata.variants.items;
  }
  return [];
};

/**
 * @param {Component[]|Variant[]} variants The data of the component variants.
 * @returns {NormalizedVariant[]} The normalized version of component variants.
 */
const normalizeVariants = (variants, parentName) => {
  const hasDefault = variants.some(metadata => metadata.name === 'default');
  return variants.filter(subItem => !subItem.isHidden).map(metadata => {
    const { id, name, label } = metadata;
    return {
      id,
      name: name === 'default' ? parentName : `${hasDefault ? `${parentName}--` : ''}${name}`,
      label,
      content: getContent(metadata),
    };
  });
};

/**
 * @param {ComponentCollection|Component} metadata The component data.
 * @returns {{id: string, name: string, label: string, content: string, notes: string, }[]} The data of the component variants.
 */
const normalizeItems = items =>
  items.filter(item => !item.isHidden).map(metadata => {
    const subItems = normalizeVariants(getVariants(metadata), metadata.name);
    const { id, name, label, notes } = metadata;
    const props = metadata.isCollection || subItems.length > 1 ? { items: subItems } : { content: getContent(metadata) };
    return {
      id,
      name,
      label,
      notes,
      ...props,
    };
  });

(() => {
  const renderRoot = document.querySelector('[data-renderroot]');
  if (renderRoot) {
    const props = {
      componentItems: normalizeItems(window.componentItems),
      docItems: window.docItems,
    };
    ReactDOM.render(<RootPage {...props} />, renderRoot);
  }
})();
