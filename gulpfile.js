var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', ['babel', 'sass', 'templates']);

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'scss/*.scss', 'templates/**/*.html'], ['default'])
});

gulp.task('babel', function () {
  gulp.src('src/**/*.js')
    .pipe(concat('all.js'))
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'));
});

gulp.task('templates', function () {
  gulp.src('templates/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('dist'));
});
