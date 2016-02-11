var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
	return gulp.src('spec/randomuserTests.js', {read: false})
		// gulp-mocha needs filepaths so you can't have any plugins before it
		.pipe(mocha({reporter: 'nyan'}));
});
