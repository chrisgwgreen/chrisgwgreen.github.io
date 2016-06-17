import gulp from 'gulp';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';

const project = {
  src: {
    client: './src/app.js',
    styles: './src/scss/*.scss'
  },
  dest: {
    scripts: './static/js/',
    styles: './static/css/'
  }
};

require('./gulp/scss')(project);
require('./gulp/eslint')(project);
require('./gulp/client')(project);
