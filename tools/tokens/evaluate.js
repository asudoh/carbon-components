'use strict';

const fs = require('fs');
const { dirname, resolve } = require('path');
const { promisify } = require('bluebird');
const yaml = require('js-yaml');
const { fromJS: ImmutableFromJS, List, Map, OrderedMap } = require('immutable');

const readFile = promisify(fs.readFile);

const loadFile = async filename =>
  ImmutableFromJS(yaml.safeLoad(await readFile(filename, 'utf8'))).merge(ImmutableFromJS({ meta: { filename } }));

const loadRefs = async (data, prop) => {
  const filename = data.get('meta', OrderedMap()).get('filename');
  const basedir = filename ? dirname(filename) : process.cwd();
  const fileContents = await Promise.all(
    data
      .get(prop, List())
      .map(async v => evaluateImpl(await loadFile(resolve(basedir, v)))) // eslint-disable-line no-use-before-define
      .toArray()
  );
  return data.set(prop, List.of(...fileContents));
};

const applyNamespaces = (aliases, namespaces) => {
  const suffixes = namespaces.toArray().reverse();
  return aliases.reduce(
    (namespaced, v, k) =>
      namespaced.set(
        k
          .split(':')
          .concat(suffixes)
          .join(':'),
        v
      ),
    OrderedMap()
  );
};

const evaluateIncludes = async data => {
  const evaluatedRefs = await loadRefs(data, 'includes');
  return evaluatedRefs
    .set(
      'imported-aliases',
      evaluatedRefs
        .get('includes', List())
        .reduce(
          (aliases, item) =>
            aliases
              .merge(item.get('imported-aliases', OrderedMap()))
              .merge(applyNamespaces(item.get('aliases', OrderedMap()), item.get('namespaces', List()))),
          OrderedMap()
        )
    )
    .set(
      'imported-props',
      evaluatedRefs
        .get('includes', List())
        .reduce(
          (props, item) =>
            props.merge(
              item
                .get('imported-props', OrderedMap())
                .merge(applyNamespaces(item.get('props', OrderedMap()), item.get('namespaces', List())))
            ),
          OrderedMap()
        )
    )
    .delete('includes');
};

const evaluateImports = async data => {
  const evaluatedRefs = await loadRefs(data, 'imports');
  return evaluatedRefs
    .set(
      'imported-aliases',
      evaluatedRefs.get('imports', List()).reduce(
        (aliases, item) =>
          aliases
            .merge(item.get('imported-props', OrderedMap()))
            .merge(item.get('imported-aliases', OrderedMap()))
            .merge(applyNamespaces(item.get('props', OrderedMap()), item.get('namespaces', List())))
            .merge(applyNamespaces(item.get('aliases', OrderedMap()), item.get('namespaces', List()))),
        OrderedMap()
      )
    )
    .delete('imports');
};

const findAlias = (aliases, name) => {
  const exact = aliases.get(name);
  if (exact) {
    return exact;
  }
  const prefix = `${name}:`;
  return aliases
    .filter((v, k) => k.indexOf(prefix) === 0)
    .reduce((aliasList, v, k) => aliasList.push(Map({ key: k, value: v })), List())
    .sort((lhs, rhs) => {
      const lhkey = lhs.get('key');
      const rhkey = rhs.get('key');
      return lhkey.slice(lhkey.indexOf(prefix)).split(':').length - rhkey.slice(rhkey.indexOf(prefix)).split(':').length;
    })
    .get(0, Map())
    .get('value');
};

const evaluateAlias = (data, name) => {
  const raw = findAlias(data.get('imported-aliases', OrderedMap()).merge(data.get('aliases', OrderedMap())), name) || '';
  return typeof raw.replace !== 'function' ? raw : raw.replace(/{!(.+?)}/g, (match, token) => evaluateAlias(data, token));
};

const evaluateAliases = data => {
  const predicate = v => typeof v === 'string' && v.replace(/{!(.+?)}/g, (match, token) => evaluateAlias(data, token));
  return data
    .update('namespaces', OrderedMap(), namespaces => namespaces.map(predicate))
    .update('props', OrderedMap(), props => props.map(predicate));
};

const evaluateImpl = async data =>
  [evaluateIncludes, evaluateImports, evaluateAliases].reduce(async (d, fn) => fn(await Promise.resolve(d)), data);

const evaluate = async data => {
  const evaluated = await evaluateImpl(data);
  return evaluated
    .update('props', OrderedMap(), props =>
      evaluated.get('imported-props', OrderedMap()).merge(applyNamespaces(props, evaluated.get('namespaces', List())))
    )
    .delete('imported-props')
    .delete('imported-aliases')
    .delete('aliases');
};

module.exports = evaluate;
