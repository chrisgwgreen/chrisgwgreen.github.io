import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import runSequence from 'run-sequence';
import sourcemaps from 'gulp-sourcemaps';

module.exports = (project) => {

  gulp.task('scss', () => {

    gutil.log('----------------------------------------');
    gutil.log('Build SCSS...');
    gutil.log('----------------------------------------');

    return gulp.src(project.src.styles)
        .pipe(sourcemaps.init())  // Process the original sources
        .pipe(sass())
        .pipe(sourcemaps.write()) // Add the map to modified source.
        .pipe(gulp.dest(project.dest.styles));

  });

  gulp.task('scss:watch', (cb) => {

    gutil.log('----------------------------------------');
    gutil.log('Watching SCSS...');
    gutil.log('----------------------------------------');

    gulp.watch(project.src.styles, () => {
      runSequence(
          'scss'
      );
    });
  });

};
