/* eslint no-underscore-dangle: [2, { "allow": ["__classId", "__carbon_classes"] }] */

import settings from '../settings';

/**
 * @param {Component} instance A Carbon component instance.
 * @returns {Object<string, WeakMap>}
 *   The list of weak maps keyed by Carbon component class name.
 *   Each weak map keep track of the unique value per Carbon component class instantiated on an element.
 *   This is for detecting a condition where two same Carbon classes are loaded in an application,
 *   and both instantiated on an element, where such two instances often complete each other.
 *   (e.g. One opens a menu and the other closes it)
 *   Note that having two same Carbon classes loaded in an application shouldn't be a problem,
 *   if one takes care of a part of an application (e.g. `<header>`) and another takes care of another (e.g. `<main>`).
 * @private
 */
const getClassIds = instance => {
  const { element, options } = instance;
  if (!element) {
    throw new TypeError(`The element cannot be found for component: ${instance}`);
  }
  if (!options) {
    throw new TypeError(`The options cannot be found for component: ${instance}`);
  }
  const { name: componentName = options.selectorInit } = instance.constructor;
  if (!componentName) {
    return undefined;
  }
  const w = element.ownerDocument.defaultView;
  const classIdsList = w.__carbon_classes || (w.__carbon_classes = {});
  const classIds = classIdsList[componentName] || (classIdsList[componentName] = new WeakMap());
  return classIds;
};

/**
 * @param {Component} instance A Carbon component instance.
 * @returns {string} The unique ID for the given Carbon component instance.
 * @private
 */
const getClassId = instance => {
  const { options } = instance;
  if (!options) {
    throw new TypeError(`The options cannot be found for component: ${instance}`);
  }
  const { name: componentName = options.selectorInit } = instance.constructor;
  if (!componentName) {
    return undefined;
  }
  const classId =
    instance.constructor.__classId ||
    (instance.constructor.__classId = `__carbon-${componentName}--${Math.random()
      .toString(36)
      .substr(2)}`);
  return classId;
};

export default function(ToMix) {
  class CreateComponent extends ToMix {
    /**
     * The component instances managed by this component.
     * Releasing this component also releases the components in `this.children`.
     * @type {Component[]}
     */
    children = [];

    /**
     * Mix-in class to manage lifecycle of component.
     * The constructor sets up this component's effective options,
     * and registers this component't instance associated to an element.
     * @implements Handle
     * @param {HTMLElement} element The element working as this component.
     * @param {Object} [options] The component options.
     */
    constructor(element, options = {}) {
      super(element, options);

      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        throw new TypeError('DOM element should be given to initialize this widget.');
      }

      /**
       * The element the component is of.
       * @type {Element}
       */
      this.element = element;

      /**
       * The component options.
       * @type {Object}
       */
      this.options = Object.assign(Object.create(this.constructor.options), options);

      if (!settings.ignoreDuplicateClassCheck) {
        const classIds = getClassIds(this);
        const classId = getClassId(this);
        if (classIds && classId) {
          const oldClassId = classIds.get(element);
          if (!oldClassId) {
            classIds.set(element, classId);
          } else if (oldClassId !== classId) {
            console.error('Detected duplicate Carbon class on element:', element); // eslint-disable-line no-console
            throw new Error(
              [
                'Detected that possibly more than one Carbon class with same name/functionality in your app.',
                [
                  'It typically happens when your application loads more than one bundles containing Carbon classes,',
                  'or carbon-components{,.min}.js is used along with a custom bundule containing Carbon.',
                ].join(' '),
                'Please ensure that there is only one set of Carbon classes in your app, by eliminating the redundant ones.',
              ].join('\n')
            );
          }
        }
      }

      this.constructor.components.set(this.element, this);
    }

    /**
     * Instantiates this component of the given element.
     * @param {HTMLElement} element The element.
     */
    static create(element, options) {
      return this.components.get(element) || new this(element, options);
    }

    /**
     * Releases this component's instance from the associated element.
     */
    release() {
      const element = this.element;
      for (let child = this.children.pop(); child; child = this.children.pop()) {
        child.release();
      }
      if (!settings.ignoreDuplicateClassCheck) {
        const classIds = getClassIds(this);
        if (classIds) {
          classIds.delete(element);
        }
      }
      this.constructor.components.delete(element);
      return null;
    }
  }
  return CreateComponent;
}
