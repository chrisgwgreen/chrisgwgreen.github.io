import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import gulpWebpack from 'webpack-stream';
import webpack from 'webpack';

module.exports = (project) => {

  gulp.task('client', () => {

    gutil.log('----------------------------------------');
    gutil.log('Babel Build Client...');
    gutil.log('----------------------------------------');

    gulp.src(project.src.client)
        .pipe(gulpWebpack({
          module: {
            loaders: [
              {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules)/,
                query: {
                  presets: ['es2015', 'react'],
                },
              },
              {
                test: /\.json$/,
                loader: 'json-loader',
              },
            ],
          },
          resolve: {
            root: path.resolve('./src'),
          },
          output: {
            filename: 'app.js',
            path: '/',
          },
        }))
        .pipe(gulp.dest(project.dest.scripts));

  });


  gulp.task('client:watch', (cb) => {

    gutil.log('----------------------------------------');
    gutil.log('Watching client...');
    gutil.log('----------------------------------------');

    gulp.watch('/components', () => {
      runSequence(
          'client'
      );
    });

  });


};
