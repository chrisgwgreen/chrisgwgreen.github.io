import gulp from 'gulp';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';

module.exports = () => {

  gulp.task('watcher', (cb) => {

    gutil.log('-----------------------------------------------------');
    gutil.log('Starting Watchers...');
    gutil.log('-----------------------------------------------------');

    runSequence(
      [
        'scss:watch',
        // 'scripts:watch',
        // 'variables:watch'
      ],
      cb
    );

  });

};
