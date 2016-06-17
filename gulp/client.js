import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import gulpWebpack from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';

module.exports = (project) => {

    gulp.task('client', () => {

        gutil.log('----------------------------------------');
        gutil.log('Babel Build Client...');
        gutil.log('----------------------------------------');

        gulp.src(project.src.client)
            .pipe(gulpWebpack(
              webpackConfig

            //   {
            //     context: __dirname,
            //     entry: "../src/app.js",
            //     output: {
            //         filename: "app.js"
            //     },
            //     module: {
            //         loaders: [{
            //             test: /\.jsx?$/,
            //             exclude: /(node_modules|bower_components)/,
            //             loader: 'babel',
            //             query: {
            //                 presets: ['react', 'es2015']
            //             }
            //         }]
            //     }
            // }
          ))
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
