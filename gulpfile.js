const { series, src, dest} = require('gulp');

const jshint = require('gulp-jshint');
const inject = require('gulp-inject');
const bowerFiles = require('main-bower-files');
const sort = require('gulp-sort');

const jsFiles = ['www/**/*.js', 'src/**/*.js', '!**/*.spec.js', '!**/mock/*.js', '!**/bower_components/**/*.js', '!**/node_modules/**/*.js'];

function hint() {
  return src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}

function index() {
  var indexFile = './public/index.html';
  var destination = './public';
  var sourceFiles = ['./public/src/**/*.js', './public/views/**/*.js'];
  var cssFiles = ['./public/**/*.css', '!./public/bower_components/**/*.css'];

  return src(indexFile).pipe(inject(src(sourceFiles, { read: false }).pipe(sort()), { relative: true }))
    .pipe(inject(src(cssFiles, { read: false }).pipe(sort()), { relative: true }))
    .pipe(inject(src(bowerFiles(), { read: false }), { name: 'bower', relative: true }))
    .pipe(dest(destination));
}

exports.default = series(hint, index);