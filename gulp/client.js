import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import gulpWebpack from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import uglify from 'gulp-uglify';

module.exports = (project) => {

  gulp.task('client', () => {

    gutil.log('---------------------Babel Build Client---------------------');

    gulp.src(project.src.client)
      .pipe(gulpWebpack(
        Object.assign(webpackConfig, {
          output: {
            filename: "app.js"
          }
        })
      ))
      .pipe(uglify())
      .pipe(gulp.dest(project.dest.scripts));
  });

  gulp.task('client:watch', (cb) => {

    gutil.log('---------------------Watching client---------------------');

    gulp.watch('/components', () => {
      runSequence(
        'client'
      );
    });

  });

};
