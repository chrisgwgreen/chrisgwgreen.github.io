import gulp from 'gulp';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';

module.exports = (project) => {

    gulp.task('eslint', () => {

        gutil.log('----------------------------------------');
        gutil.log('Eslint...');
        gutil.log('----------------------------------------');

        return gulp.src(project.src.root)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError());

    });

};
