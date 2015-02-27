var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
 
// Basic usage 
gulp.task('scripts', function() {
  // Single entry point to browserify 
 var entryFile = './app.jsx';

  var bundler = browserify({
    cache: {},
    packageCache: {},
    //fullPaths: true,
    debug: true,
    extensions: ['.js', '.es6.js', '.jsx'],
  });

  bundler
    .transform(babelify.configure({
      ignore: false,
      only: /.+(?:(?:\.es6\.js)|(?:.jsx))$/,
      extensions: ['.js', '.es6.js', '.jsx' ],
      sourceMap: true,
    }), {
      global: true,
    });

  bundler.add(entryFile);

  bundler
    .require("babel/polyfill");

  var stream = bundler.bundle();
  stream.on('error', function (err) { console.error(err.toString()) });

  stream
    .pipe(source(entryFile))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', function() {
  gulp.watch('app.jsx', ['scripts']);
});