var gulp = require('gulp');
var less = require('gulp-less');
var nano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var transpile = require('gulp-babel');
var jshint = require('gulp-jshint');
var lesshint = require('gulp-lesshint');
var watch = require('gulp-watch');
var jasmine = require('gulp-jasmine-browser');

var allJsFiles = [
    'bower_components/underscore/underscore-min.js',
    'bower_components/handlebars/handlebars.min.js',
    'js/vendor/colora11y.js',
    'src/js/color-palette.js',
    'test/js/*Spec.js'
];

gulp.task('travis', ['jshint','lesshint']);

gulp.task('default', ['watch']);

gulp.task('test-browser', function () {
    return gulp.src(allJsFiles)
        .pipe(watch(allJsFiles))
        .pipe(jasmine.specRunner())
        .pipe(jasmine.server({port: 8000}));
});

gulp.task('test-headless', function() {
    return gulp.src(allJsFiles)
        .pipe(jasmine.specRunner({console: true}))
        .pipe(jasmine.headless());
});

gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(nano({
            autoprefixer: {add:'true'}
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('jsmin', function () {
    return gulp.src('src/js/*.js')
        .pipe(transpile())
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('jshint', function () {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('lesshint', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(lesshint())
        .pipe(lesshint.reporter())
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['jshint','jsmin']);
    gulp.watch('src/less/**/*.less', ['less']);
});