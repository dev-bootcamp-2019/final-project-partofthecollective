const gulp = require('gulp');
const run = require('gulp-run');
const gutil = require('gulp-util');

gulp.task('truffle-migrate', () => {
  gutil.log('== Running truffle migrate command ==');
  return run('truffle migrate --reset').exec();
});

gulp.task('copy-truffle-build', () => {
  gutil.log('== Copying contract build files to dApp application ==');
  return gulp.src('build/**/*.json')
    .pipe(gulp.dest('ui/src/contractBuilds/'));
});

const build = gulp.series('truffle-migrate', 'copy-truffle-build');
exports.default = build;
