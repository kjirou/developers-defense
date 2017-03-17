'use strict';

const autoprefixer = require('autoprefixer');
const babelify = require('babelify');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const fs = require('fs');
const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const gulpPostcss = require('gulp-postcss');
const gulpRename = require('gulp-rename');
const gulpSass = require('gulp-sass');
const gulpUtil = require('gulp-util');
const notifier = require('node-notifier');
const path = require('path');
const runSequence = require('run-sequence');
const vinylSourceStream  = require('vinyl-source-stream');
const watchify = require('watchify');


const ROOT = __dirname;
const SOURCE_ROOT = path.join(ROOT, 'src');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const PUBLIC_DIST_ROOT = path.join(PUBLIC_ROOT, 'dist');
const JS_SOURCE_INDEX_FILE_PATH = path.join(SOURCE_ROOT, 'index.js');
const CSS_SOURCE_INDEX_FILE_PATH = path.join(SOURCE_ROOT, 'index.sass');
const CSS_SOURCE_PATTERNS = [
  path.join(SOURCE_ROOT, '**/*.sass'),
];
const STATIC_FILE_PATTERNS = [
  path.join(SOURCE_ROOT, '**/*.{gif,jpg,png}'),
  path.join(SOURCE_ROOT, '**/*.css'),
  path.join(SOURCE_ROOT, '**/*.{eot,svg,ttf,woff}'),
];
const DATA_URI_IMAGE_PATTERNS = [
  path.join(SOURCE_ROOT, 'images/*.png'),
];
const APP_NAME = 'developers-defense';

const browserSyncInstance = browserSync.create();

const babelRc = fs.readFileSync(path.join(ROOT, '.babelrc'));
const babelRcData = JSON.parse(babelRc.toString());


/*
 * Utils
 */

const handleErrorAsWarning = function(err) {
  gulpUtil.log(err.stack || err.message);
  notifier.notify({
    message: err.message,
    title: 'Gulp Error',
  });
  this.emit('end');
}


/*
 * .js builders
 */

const createBabelTransformer = () => {
  return babelify.configure();
};

/**
 * Return a instance of the Browserify set up just before `.bundle()`
 * @param {string} indexFilePath
 * @param {(Object|undefined)} options
 * @param {?Object} [options.transformer]
 * @param {?boolean} [options.isWatchified]
 * @return {Browserify}
 */
const configureBrowserify = (indexFilePath, options = {}) => {
  options = Object.assign({
    transformer: createBabelTransformer(),
    isWatchified: false,
  }, options);

  const browserifyOptions = {
    debug: true,
  };

  if (options.isWatchified) {
    Object.assign(browserifyOptions, watchify.args);
  }

  // Pass options to browserify by whitelist
  [
    'debug'
  ].forEach(key => {
    if (key in options) {
      browserifyOptions[key] = options[key];
    }
  });

  let bundler = browserify(indexFilePath, browserifyOptions);

  if (options.transformer) {
    bundler.transform(options.transformer);
  }

  if (options.isWatchified) {
    bundler = watchify(bundler);
  }

  return bundler;
}

const bundleJsSources = (bundler, options) => {
  options = Object.assign({
    errorHandler: function(err) {
      throw err;
    },
    outputFileName: `${ APP_NAME }.js`,
  }, options || {});

  return bundler
    .bundle()
    .on('error', options.errorHandler)
    .pipe(vinylSourceStream(options.outputFileName))
    .pipe(gulp.dest(PUBLIC_DIST_ROOT))
  ;
}

gulp.task('build:js', function() {
  const bundler = configureBrowserify(JS_SOURCE_INDEX_FILE_PATH);
  return bundleJsSources(bundler);
});

gulp.task('build:js:production', function() {
  const bundler = configureBrowserify(JS_SOURCE_INDEX_FILE_PATH, {
    debug: false,
  });
  return bundleJsSources(bundler, { outputFileName: `${ APP_NAME }.prod.js` });
});

gulp.task('watch:js', function() {
  const bundler = configureBrowserify(JS_SOURCE_INDEX_FILE_PATH, {
    isWatchified: true,
  });
  bundleJsSources(bundler);  // TODO: Why is this necessary?

  bundler.on('update', function() {
    gulpUtil.log(`Built JavaScript code`);
    bundleJsSources(bundler, { errorHandler: handleErrorAsWarning })
      .pipe(browserSyncInstance.stream({ once: true }))
    ;
  });
});


/*
 * .css builders
 */

const bundleCssSources = (indexFilePath, options) => {
  options = Object.assign({
    errorHandler: function(err) { throw err; },
    outputFileName: `${ APP_NAME }.css`,
  }, options || {});

  return gulp.src(indexFilePath)
    .pipe(
      gulpSass({
        includePaths: [ path.join(ROOT, 'node_modules/sanitize.css') ],
      })
      .on('error', options.errorHandler)
    )
    .pipe(
      gulpPostcss([
        autoprefixer({
          browsers: ['last 2 versions'],
        }),
      ])
    )
    .pipe(gulpRename(options.outputFileName))
    .pipe(gulp.dest(PUBLIC_DIST_ROOT))
  ;
};

gulp.task('build:css', function() {
  return bundleCssSources(CSS_SOURCE_INDEX_FILE_PATH);
});

gulp.task('watch:css', function() {
  gulp.watch(CSS_SOURCE_PATTERNS, function() {
    return bundleCssSources(CSS_SOURCE_INDEX_FILE_PATH, { errorHandler: handleErrorAsWarning })
      .pipe(browserSyncInstance.stream({ once: true }))
      .on('data', () => gulpUtil.log('Built CSS code'))
    ;
  });
});


/*
 * Static files
 */

gulp.task('build:static-files', function() {
  return gulp.src(STATIC_FILE_PATTERNS)
    .pipe(gulp.dest(PUBLIC_DIST_ROOT))
  ;
});

// Notice: gulp can not observe new files
gulp.task('watch:static-files', function() {
  gulp.watch(STATIC_FILE_PATTERNS, function() {
    return gulp.src(STATIC_FILE_PATTERNS)
      .on('error', handleErrorAsWarning)
      .pipe(gulp.dest(PUBLIC_DIST_ROOT))
      // TODO: Output this message for each file
      .on('data', () => gulpUtil.log('Built static files'))
    ;
  });
});


/*
 * Others
 */

gulp.task('serve', function() {
  browserSyncInstance.init({
    server: {
      baseDir: PUBLIC_ROOT,
    },
    notify: false,
  });
});


/**
 * Public APIs
 */

gulp.task('build', ['build:js', 'build:css', 'build:static-files']);
gulp.task('develop', function() {
  runSequence('build', ['watch:js', 'watch:css', 'watch:static-files'], 'serve');
});
