var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var babelify = require('babelify');
var factor = require('factor-bundle');
var uglify = require('gulp-uglify');

gulp.task('browserify', function() {
    return browserify({
            entries: ['./src/scripts/app.jsx'],
            extensions: ['.jsx'],
            debug: false
        })
        .transform(babelify, {
          presets: ['es2015', 'react']
        })
        .plugin(factor, {
          o: [
            'public/app.js'
          ]
        })
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('app.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('copy', function () {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('copy-assets', function () {
  return gulp.src('./src/assets/*')
    .pipe(gulp.dest('./public/assets/'));
});

// Make sure React is in production mode
gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('watch', function () {
  gulp.watch(['./src/scripts/**/*.js', './src/scripts/**/*.jsx'], ['browserify']);
  gulp.watch('./src/scss/*.scss', ['sass']);
  gulp.watch('./src/*.html', ['copy']);
  gulp.watch('./src/assets/*', ['copy-assets']);
});

gulp.task('compress', function () {
  return gulp.src('public/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('default', ['apply-prod-environment', 'browserify', 'watch']);
