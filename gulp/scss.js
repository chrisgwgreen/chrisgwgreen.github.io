import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import runSequence from 'run-sequence';
import sourcemaps from 'gulp-sourcemaps';

module.exports = (project) => {

  gulp.task('scss', () => {

    gutil.log('---------------------Build SCSS---------------------');

    return gulp.src(project.src.styles)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(project.dest.styles));

  });

  gulp.task('scss:watch', (cb) => {

    gutil.log('---------------------Watching SCSS---------------------');

    gulp.watch(project.src.styles, () => {
      runSequence(
        'scss'
      );
    });

  });

};
