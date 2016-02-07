/* jshint esnext: true */
/* jshint node: true */
"use strict";

const gulp = require('gulp');
const del = require('del');
const markdown = require('gulp-markdown-to-json');
const gutil = require('gulp-util');
const jsonTransform = require('gulp-json-transform');

gulp.task('clean', function () {
  return del('server/**/*');
});

gulp.task('markdown', ['clean'], function () {
  return gulp.src('content/entries/**/*.md')
    .pipe(gutil.buffer())
    .pipe(markdown('entries.json'))
    .pipe(gulp.dest('server'));
});

gulp.task('server', ['markdown'], function () {
  return gulp.src('server/**/*.json')
    .pipe(jsonTransform(object => {
      return Object.keys(object).map(key => {
        object[key].id = parseInt(key);
        return object[key];
      });
    }))
    .pipe(gulp.dest('server'));
});

gulp.task('default', ['server']);
