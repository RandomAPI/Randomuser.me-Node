var gulp       = require('gulp');
var mocha      = require('gulp-mocha');
var uglify     = require('gulp-uglifyjs');
var concat     = require('gulp-concat');
var exit       = require('gulp-exit');
var minifyCss  = require('gulp-cssnano');
var ejsmin     = require('gulp-ejsmin');
var through    = require('through2')


gulp.task('default', ['testEnv'], function () {
  return gulp.src('spec/randomuserTests.js', {read: false})
    .pipe(mocha({require: ['mocha-clean'], reporter: 'nyan'}))
    .pipe(exit());
});

gulp.task('spec', ['testEnv'], function () {
  return gulp.src('spec/randomuserTests.js', {read: false})
    .pipe(mocha({require: ['mocha-clean'], reporter: 'spec'}))
    .pipe(exit());
});

gulp.task('compress', function() {
  return gulp.src(['public/js/jquery.js', 'public/js/*.js'])
    .pipe(uglify('all.js'))
    .pipe(gulp.dest('public/dist/'));
});

gulp.task('css', function() {
  return gulp.src('public/css/*.css')
    .pipe(concat('style.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dist/'));
});

gulp.task('minify-ejs-pages', function() {
  var preLocs = [];
  return gulp.src('views/pages/*.ejs')
    .pipe(through.obj(function (chunk, enc, cb) {
      var contents = chunk.contents.toString('utf8');
      var preMatches = contents.match(/<pre>((?:.|\n)*?)<\/pre>/g);
      if (preMatches) {
        preMatches.forEach(function(match) {
          preLocs.push(match);
          contents = contents.replace(match, "PRE_MATCH_" + (preLocs.length-1));
        });
        chunk.contents = new Buffer(contents, "utf8");
      }
      //console.log('chunk', chunk.contents) // this should log now
      cb(null, chunk)
    }))
    .pipe(ejsmin())
    .pipe(through.obj(function (chunk, enc, cb) {
      var contents = chunk.contents.toString('utf8');

      var search = new RegExp(/PRE_MATCH_(\d+)/g);
      var match  = search.exec(contents);
      while (match != null) {
        contents = contents.replace("PRE_MATCH_" + match[1], preLocs[match[1]]);
        match = search.exec(contents);
      }
      chunk.contents = new Buffer(contents, "utf8");
      //console.log('chunk', chunk.contents) // this should log now
      cb(null, chunk)
    }))
    .pipe(gulp.dest('.viewsMin/pages'))
});

gulp.task('minify-ejs-snippets', function() {
  return gulp.src('views/snippets/*.ejs')
    .pipe(ejsmin())
    .pipe(gulp.dest('.viewsMin/snippets'))
});

gulp.task('testEnv', function() {
    return process.env.spec = true;
});

gulp.task('build', ['compress', 'css', 'minify-ejs-pages', 'minify-ejs-snippets']);

gulp.task('start', ['compress', 'css', 'minify-ejs-pages', 'minify-ejs-snippets'], function() {
  require('./server');
});
