var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');

gulp.task('browserify', function() {
    return browserify('./scripts/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./scripts/'));
});

gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./styles'));
});

gulp.task('watch', function () {
  gulp.watch('./scripts/**/*.js', ['browserify']);
  gulp.watch('./scss/*.scss', ['sass']);
});

gulp.task('default', ['browserify', 'watch']);
