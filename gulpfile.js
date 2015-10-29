"use strict";

var gulp = require('gulp'),
	rename = require('gulp-rename'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),

	spritesmith = require('gulp.spritesmith'),
	merge = require('merge-stream'),

	sass = require('gulp-sass'),
	coffee = require('gulp-coffee'),

	minifyCss = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify');

/********************************/
/* Connect
/********************************/
gulp.task('connect', function() {
	connect.server({
		root: 'app',
		livereload: true
	});
});

/********************************/
/* Sass
/********************************/
gulp.task('sass', function () {
	gulp.src('_src/sass/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('all.css'))
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(rename('bundle.min.css'))
		.pipe(gulp.dest('app/css/'))
		.pipe(connect.reload());
});

/********************************/
/* Coffee
/********************************/
gulp.task('coffee', function() {
	gulp.src('_src/coffee/*.coffee')
		.pipe(coffee())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('common.min.js'))
		.pipe(gulp.dest('app/js/'))
		.pipe(connect.reload());
});

/********************************/
/* Html
/********************************/
gulp.task('html', function() {
	gulp.src('app/index.html')
		.pipe(connect.reload());
});

/********************************/
/* Sprites
/********************************/
gulp.task('sprite', function() {
	var spriteData = gulp.src('_src/sprites/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.sass'
  }));

  var imgStream = spriteData.img
    .pipe(gulp.dest('app/img/'));

  var cssStream = spriteData.css
    .pipe(gulp.dest('_src/sass/'));
});

/********************************/
/* Watch
/********************************/
gulp.task('watch', function() {
	gulp.watch('_src/sass/*.sass', ['sass']);
	gulp.watch('_src/coffee/*.coffee', ['coffee']);
	gulp.watch('app/index.html', ['html']);
	gulp.watch('_src/sprites/*.png', ['sprite']);
});

/********************************/
/* Default
/********************************/
gulp.task('default', ['connect', 'sass', 'coffee', 'html', 'sprite', 'watch']);