var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var minifyCSS = require('gulp-csso');

gulp.task('js', function() {
	gulp.src('./dist/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('./dist/'));
});

gulp.task('css', function(){
  return gulp.src('./dist/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/'))
});
