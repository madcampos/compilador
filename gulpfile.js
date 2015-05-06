var gulp = require('gulp');
var documentation = require('documentation');

gulp.task('default', function(){

});

gulp.task('docs', function(){
	gulp.src('*.js').pipe(documentation({ format: 'md' })).pipe(gulp.dest('docs/md'));
	gulp.src('*.js').pipe(documentation({ format: 'html' })).pipe(gulp.dest('docs/html'));
	gulp.src('*.js').pipe(documentation({ format: 'json' })).pipe(gulp.dest('docs/json'));

});