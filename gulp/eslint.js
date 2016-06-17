import gulp from 'gulp';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';

module.exports = (project) => {

  gulp.task('eslint', () => {

    gutil.log('---------------------Eslint---------------------');

    return gulp.src('./*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());

  });

};
