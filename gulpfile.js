const gulp       = require('gulp');
const mocha      = require('gulp-mocha');
const terser     = require('gulp-terser');
const concat     = require('gulp-concat');
const minifyCss  = require('gulp-cssnano');
const ejsmin     = require('gulp-ejsmin');
const through    = require('through2')

gulp.task('testEnv', (done) => {
  process.env.spec = true;
  done();
});

gulp.task('default', gulp.series('testEnv', test = (done) => {
  gulp.src('spec/index.js', {read: false})
    .pipe(mocha({require: ['mocha-clean'], reporter: 'nyan', exit: true}))
  done();
}));

gulp.task('spec', gulp.series('testEnv', test = (done) => {
  gulp.src('spec/index.js', {read: false})
    .pipe(mocha({require: ['mocha-clean'], reporter: 'spec', exit: true}))
  done();
}));

gulp.task('compress', () => {
  return gulp.src(['public/js/ready.min.js', 'public/js/pegasus.min.js', '!public/js/highcharts.js', 'public/js/*.js'])
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(gulp.dest('public/dist/'));
});

gulp.task('css', () => {
  return gulp.src('public/css/*.css')
    .pipe(concat('style.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dist/'));
});

gulp.task('minify-ejs-pages', () => {
  // Save the pre tag contents
  let preLocs = [];

  return gulp.src('views/pages/*.ejs')
    .pipe(through.obj((chunk, enc, cb) => {
      let contents = chunk.contents.toString('utf8');
      let preMatches = contents.match(/<pre>((?:.|\n)*?)<\/pre>/g);

      if (preMatches) {
        preMatches.forEach(match => {
          preLocs.push(match);
          contents = contents.replace(match, 'PRE_MATCH_' + (preLocs.length-1));
        });
        chunk.contents = Buffer.from(contents, 'utf8');
      }

      cb(null, chunk)
    }))
    .pipe(ejsmin())
    .pipe(through.obj((chunk, enc, cb) => {
      let contents = chunk.contents.toString('utf8');
      let search = new RegExp(/PRE_MATCH_(\d+)/g);
      let match  = search.exec(contents);

      while (match != null) {
        contents = contents.replace('PRE_MATCH_' + match[1], preLocs[match[1]]);
        match = search.exec(contents);
      }

      chunk.contents = Buffer.from(contents, 'utf8');
      cb(null, chunk)
    }))
    .pipe(gulp.dest('.viewsMin/pages'))
});

gulp.task('minify-ejs-snippets', () => {
  return gulp.src('views/snippets/*.ejs')
    .pipe(ejsmin())
    .pipe(gulp.dest('.viewsMin/snippets'))
});

gulp.task('build', gulp.series(['compress', 'css', 'minify-ejs-pages', 'minify-ejs-snippets']));

gulp.task('start', gulp.series(['compress', 'css', 'minify-ejs-pages', 'minify-ejs-snippets'], () => {
  require('./server');
}));
