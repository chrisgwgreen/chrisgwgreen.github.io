const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');

let browserSync;

const project = {
  src: {
    root: 'src/',
    clean: 'public/**/*',
    client: 'static/app.js',
    server: 'src/server/server.js',
    static: 'src/client/html/**/*.html',
    styles: 'src/scss/*.scss',
    images: 'src/client/img/**/*',
    fonts: 'src/client/fonts/**/*',
    vscripts: 'src/client/js/**/*.js',
    error: 'src/client/404.html',
    variables: 'src/client/scss/_variables.scss',
    config: 'src/components/config/**/*'
  },
  dest: {
    static: 'public/',
    styles: 'static/css/',
    images: 'public/img/',
    fonts: 'public/fonts/',
    scripts: 'static/js/',
    variables: 'src/components/config/',
    dist: 'dist',
    config: 'dist/components/config/'
  }
};

// -------------------------
// SUB TASKS
// -------------------------

require('./gulp/scss')(project);
require('./gulp/eslint')(project);
require('./gulp/client')(project);
require('./gulp/watcher')();
