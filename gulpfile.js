'use strict';

// Node
const path = require('path');

// Styles
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Javascript deps
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const { promisify } = require('bluebird');

// BrowserSync/NodeMon
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');

// Gulp
const gulp = require('gulp');
const through = require('through2');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const jsdoc = require('gulp-jsdoc3');

// Rollup
const rollup = require('rollup');
const rollupConfigDev = require('./tools/rollup.config.dev');
const rollupConfigProd = require('./tools/rollup.config');

// WebPack
const webpack = promisify(require('webpack'));
const webpackDevConfig = require('./tools/webpack.dev.config');

// Design tokens
const theo = require('gulp-theo');
const prefixTokens = require('./tools/prefix-tokens');

// JSDoc
const jsdocConfig = require('gulp-jsdoc3/dist/jsdocConfig.json');

// Generic utility
const del = require('del');

// Test environment
const Server = require('karma').Server;
const commander = require('commander');

const assign = v => v;
const cloptions = commander
  .option('-k, --keepalive', 'Keeps browser open after first run of Karma test finishes')
  .option('--name [name]', 'Component name used for aXe testing', assign, '')
  .option('-p, --port [port]', 'Uses the given port for dev env', assign, 3000)
  .option('-r, --rollup', 'Uses Rollup for dev env')
  .option('--serverport [port]', 'Uses the given port for dev env server', assign, 8080)
  .parse(process.argv);

// Axe A11y Test
const axe = require('gulp-axe-webdriver');

/**
 * BrowserSync
 */

gulp.task('browser-sync', ['sass:dev'], cb => {
  let started;
  const options = {
    script: './server.js',
    ext: 'dust js',
    watch: ['demo/**/*.dust', 'server.js'],
    env: {
      PORT: cloptions.serverport,
    },
  };
  nodemon(options)
    .on('start', () => {
      if (!started) {
        started = true;
        browserSync.init({
          logPrefix: 'Carbon Components',
          open: false,
          port: cloptions.port,
          proxy: `localhost:${cloptions.serverport}`,
          timestamps: false,
        });
        cb();
      }
    })
    .on('restart', () => {
      browserSync.reload();
    });
});

/**
 * Clean
 */

// Use: npm run prebuild
gulp.task('clean', () =>
  del([
    'scss',
    'css',
    'es',
    'umd',
    'scripts',
    'html',
    'dist',
    'demo/**/*.{js,map}',
    '!demo/js/components/**/*',
    '!demo/js/demo-switcher.js',
    '!demo/js/theme-switcher.js',
    '!demo/js/prism.js',
    '!demo/index.js',
    '!demo/polyfills/*.js',
  ])
);

/**
 * Design Token Tasks
 */

gulp.task('tokens:sass:globals', () =>
  gulp
    .src('src/globals/tokens/color-theme.yml')
    .pipe(
      theo
        .plugin({
          transform: { type: 'web' },
          format: { type: 'scss' },
        })
        .on('error', gutil.log)
    )
    .pipe(gulp.dest('scss/globals/tokens'))
);

gulp.task('tokens:sass:components', () =>
  gulp
    .src(['src/components/**/*.yml', '!src/components/**/_*.yml'])
    .pipe(
      theo
        .plugin({
          transform: { type: 'web' },
          format: { type: 'map.scss' },
        })
        .on('error', gutil.log)
    )
    .pipe(
      through.obj((file, enc, cb) => {
        file.contents = Buffer.from(file.contents.toString('utf8').replace(/(\$[\w\-_]+)-map\b/, '$1'));
        cb(null, file);
      })
    )
    .pipe(
      rename(filePath => {
        filePath.basename = filePath.basename.replace(/\.map$/i, '');
      })
    )
    .pipe(gulp.dest('scss/components'))
);

gulp.task('tokens:sass', ['tokens:sass:globals', 'tokens:sass:components']);

gulp.task('tokens:json:types', () =>
  gulp
    .src(['src/components/**/*.yml', '!src/components/**/_*.yml'])
    .pipe(
      theo
        .plugin({
          transform: { type: 'web' },
          format: { type: 'json' },
        })
        .on('error', gutil.log)
    )
    .pipe(gulp.dest('tokens'))
);

gulp.task('tokens:json:component', ['tokens:json:types'], () => {
  const contents = new Map();
  const table = {
    accordion: {
      classes: {
        'item-active': 'classActive',
      },
      selectors: {
        init: 'selectorInit',
        item: 'selectorAccordionItem',
        heading: 'selectorAccordionItemHeading',
        content: 'selectorAccordionContent',
      },
    },
  };
  return gulp
    .src('tokens/**/*.json')
    .pipe(
      through.obj(
        (file, enc, done) => {
          const dirname = path.dirname(file.relative);
          const basename = path.basename(file.relative, '.json');
          const tokens = /^(\w+)--(\w+)$/.exec(basename) || [];
          if (dirname === tokens[1]) {
            const dirContents = contents.get(dirname) || new Map();
            dirContents.set(tokens[2], file);
            contents.set(dirname, dirContents);
          }
          done();
        },
        function endStream(cb) {
          // eslint-disable-line prefer-arrow-callback
          try {
            contents.forEach((dirContents, dirname) => {
              // const file = dirContents.values().next().value.close({ contents: false });
              let lastFile;
              const o = {};
              dirContents.forEach((file, name) => {
                lastFile = file;
                Object.assign(o, prefixTokens(JSON.parse(file.contents.toString('utf8')), (table[dirname] || {})[name]));
              });
              if (lastFile) {
                const file = lastFile.clone({ contents: false });
                file.path = path.join(path.dirname(lastFile.path), `${dirname}.json`);
                file.contents = new Buffer(JSON.stringify(o, null, 2));
                this.push(file);
              }
            });
            cb();
          } catch (err) {
            cb(err);
          }
        }
      )
    )
    .pipe(gulp.dest('tokens'));
});

gulp.task('tokens:json', ['tokens:json:component']);

/**
 * JavaScript Tasks
 */

gulp.task('scripts:dev', () => {
  if (cloptions.rollup) {
    return rollup
      .rollup(rollupConfigDev)
      .then(bundle => bundle.write(rollupConfigDev))
      .then(() => {
        browserSync.reload();
      });
  }
  return webpack(webpackDevConfig).then(stats => {
    gutil.log(
      '[webpack:build]',
      stats.toString({
        colors: true,
      })
    );
  });
});

gulp.task('scripts:umd', () => {
  const srcFiles = ['./src/**/*.js'];
  const babelOpts = {
    presets: [
      [
        'env',
        {
          targets: {
            browsers: ['last 1 version', 'ie >= 11'],
          },
        },
      ],
    ],
    plugins: ['transform-es2015-modules-umd', 'transform-class-properties'],
  };

  return gulp
    .src(srcFiles)
    .pipe(babel(babelOpts))
    .pipe(gulp.dest('umd/'));
});

gulp.task('scripts:es', () => {
  const srcFiles = ['./src/**/*.js'];
  const babelOpts = {
    presets: [
      [
        'env',
        {
          modules: false,
          targets: {
            browsers: ['last 1 version', 'ie >= 11'],
          },
        },
      ],
    ],
    plugins: ['transform-class-properties'],
  };

  return gulp
    .src(srcFiles)
    .pipe(babel(babelOpts))
    .pipe(gulp.dest('es/'));
});

gulp.task('scripts:rollup', () => rollup.rollup(rollupConfigProd).then(bundle => bundle.write(rollupConfigProd)));

gulp.task('scripts:compiled', ['scripts:rollup'], cb => {
  const srcFile = './scripts/carbon-components.js';

  pump([gulp.src(srcFile), uglify(), rename('carbon-components.min.js'), gulp.dest('scripts')], cb);
});

/**
 * Sass Tasks
 */

gulp.task('sass:compiled', ['tokens:sass'], () => {
  function buildStyles(prod) {
    return gulp
      .src('src/globals/scss/styles.scss')
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          includePaths: ['node_modules', path.resolve(__dirname, 'scss/globals/tokens')],
          outputStyle: prod ? 'compressed' : 'expanded',
        }).on('error', sass.logError)
      )
      .pipe(
        autoprefixer({
          browsers: ['> 1%', 'last 2 versions'],
        })
      )
      .pipe(
        rename(filePath => {
          if (filePath.basename === 'styles') {
            filePath.basename = 'carbon-components';
          }
          if (prod) {
            filePath.extname = `.min${filePath.extname}`;
          }
        })
      )
      .pipe(
        sourcemaps.write('.', {
          includeContent: false,
          sourceRoot: '../src',
        })
      )
      .pipe(gulp.dest('css'))
      .pipe(browserSync.stream({ match: '**/*.css' }));
  }

  buildStyles(); // Expanded CSS
  buildStyles(true); // Minified CSS
});

gulp.task('sass:dev', ['tokens:sass'], () =>
  gulp
    .src('demo/scss/demo.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ['node_modules', path.resolve(__dirname, 'scss/globals/tokens')],
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ['> 1%', 'last 2 versions'],
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('demo'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('sass:source', () => {
  const srcFiles = './src/**/*.scss';

  return gulp.src(srcFiles).pipe(gulp.dest('scss'));
});

gulp.task('html:source', () => {
  const srcFiles = './src/components/**/*.html';

  return gulp.src(srcFiles).pipe(gulp.dest('html'));
});

/**
 * JSDoc
 */

gulp.task('jsdoc', cb => {
  gulp
    .src('./src/**/*.js')
    .pipe(
      babel({
        plugins: ['transform-class-properties', 'transform-object-rest-spread'],
        babelrc: false,
      })
    )
    .pipe(gulp.dest('./docs/js/tmp'))
    .on('end', () => {
      gulp.src(['README.md', 'docs/js/tmp/**/*.js'], { read: false }).pipe(
        jsdoc(
          Object.assign(jsdocConfig, {
            // eslint-disable-line global-require
            opts: {
              destination: './docs/js',
            },
          }),
          err => {
            if (err) {
              cb(err);
            } else {
              del('./docs/js/tmp', cb);
            }
          }
        )
      );
    })
    .on('error', cb);
});

/**
 * Test
 */

gulp.task('test', ['test:unit', 'test:a11y']);

gulp.task('test:unit', done => {
  new Server(
    {
      configFile: path.resolve(__dirname, 'tests/karma.conf.js'),
      singleRun: !cloptions.keepalive,
    },
    done
  ).start();
});

gulp.task('test:a11y', ['sass:compiled'], done => {
  const componentName = cloptions.name;
  const options = {
    a11yCheckOptions: {
      rules: {
        'html-has-lang': { enabled: false },
        bypass: { enabled: false },
        'image-alt': { enabled: false },
      },
    },
    verbose: true,
    showOnlyViolations: true,
    exclude: '.offleft, #flex-col, #flex-row',
    tags: ['wcag2aa', 'wcag2a'],
    folderOutputReport: !componentName ? 'tests/axe/allHtml' : 'tests/axe',
    saveOutputIn: !componentName ? `a11y-html.json` : `a11y-${componentName}.json`,
    urls: !componentName ? ['http://localhost:3000'] : [`http://localhost:3000/component/${componentName}/`],
  };

  return axe(options, done);
});

// Watch Tasks
gulp.task('watch', () => {
  gulp.watch('src/**/**/*.html').on('change', browserSync.reload);
  if (cloptions.rollup) {
    gulp.watch(['src/**/**/*.js', 'demo/**/**/*.js', '!demo/demo.js'], ['scripts:dev']);
  }
  gulp.watch(['src/**/**/*.scss', 'demo/**/*.scss', 'src/**/**/*.yml'], ['sass:dev']);
  gulp.watch('src/**/*.yml', ['tokens:json']);
});

gulp.task('serve', ['browser-sync', 'watch']);

// Build task collection
gulp.task('build:scripts', ['scripts:umd', 'scripts:es', 'scripts:compiled', 'scripts:dev']);
gulp.task('build:styles', ['sass:compiled', 'sass:source']);

// Mapped to npm run build
gulp.task('build', ['build:scripts', 'build:styles', 'html:source']);

// For demo environment
gulp.task('build:dev', ['sass:dev', 'scripts:dev']);

gulp.task('default', () => {
  // eslint-disable-next-line no-console
  console.log('\n\n Please use `$ npm run dev` and navigate to \n http://localhost:3000 to view project locally \n\n');
});
