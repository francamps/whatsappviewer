var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify('./scripts/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./scripts/'));
});

gulp.task('watch', function () {
  gulp.watch('./scripts/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify', 'watch']);
