'use strict';

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const useExternalCss = process.env.CARBON_REACT_STORYBOOK_USE_EXTERNAL_CSS === 'true';

const useStyleSourceMap = process.env.CARBON_REACT_STORYBOOK_USE_STYLE_SOURCEMAP === 'true';

class HandlebarsRuntimeProxyPlugin {
  /**
   * A WebPack resolver plugin that proxies module request
   * for `handlebars/runtime` to `handlebars/dist/amd/handlebars.runtime.js`,
   * only if it's requested from `.storybook/handlebars/handlebars`.
   */
  constructor() {
    this.source = 'before-described-relative';
  }

  apply(resolver) {
    resolver.plugin(this.source, (request, callback) => {
      if (
        /handlebars[/\\]runtime$/i.test(request.path) &&
        request.context.issuer === require.resolve('./handlebars/handlebars')
      ) {
        request.path = require.resolve('handlebars/dist/amd/handlebars.runtime');
      }
      callback();
    });
  }
}

const styleLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap: useStyleSourceMap,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        require('autoprefixer')({
          browsers: ['last 1 version', 'ie >= 11'],
        }),
      ],
      sourceMap: useStyleSourceMap,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      includePaths: [path.resolve(__dirname, '..', 'node_modules')],
      data: `
        $css--plex: true;
        $feature-flags: (
          ui-shell: true,
        );
      `,
      sourceMap: useStyleSourceMap,
    },
  },
];

module.exports = ({ config }) => {
  config.devtool = useStyleSourceMap ? 'source-map' : '';
  config.optimization = {
    ...config.optimization,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          mangle: false,
        },
      }),
    ],
  };

  // Transpile `lit-html` and `@carbon/icons-handlebars`
  const babelLoaderRule = config.module.rules.find(
    item => item.use && item.use.some && item.use.some(use => /babel-loader/i.test(use.loader))
  );
  if (babelLoaderRule) {
    config.module.rules.unshift({
      use: babelLoaderRule.use,
      include: [path.dirname(require.resolve('lit-html')), path.dirname(require.resolve('@carbon/icons-handlebars'))],
    });
  }

  // `carbon-components` does not use `polymer-webpack-loader` as it does not use full-blown Polymer
  const htmlRuleIndex = config.module.rules.findIndex(
    item => item.use && item.use.some && item.use.some(use => /polymer-webpack-loader/i.test(use.loader))
  );
  if (htmlRuleIndex >= 0) {
    config.module.rules.splice(htmlRuleIndex, 1);
  }

  config.module.rules.push(
    {
      test: /\.html$/,
      use: 'raw-loader',
    },
    {
      test: /\.hbs$/,
      use: {
        loader: 'handlebars-loader',
        options: {
          runtime: path.resolve(__dirname, './handlebars/handlebars'),
        },
      },
    }
  );

  config.module.rules.push({
    test: /\.scss$/,
    sideEffects: true,
    use: [{ loader: useExternalCss ? MiniCssExtractPlugin.loader : 'style-loader' }, ...styleLoaders],
  });

  if (useExternalCss) {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      })
    );
  }

  config.resolve = config.resolve || {};
  config.resolve.alias = Object.assign(config.resolve.alias || {}, {
    handlebars: 'handlebars/dist/amd/handlebars',
  });
  config.resolve.plugins = config.resolve.plugins || [];
  config.resolve.plugins.push(new HandlebarsRuntimeProxyPlugin());

  return config;
};
