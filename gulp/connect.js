'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect');

module.exports = function(options) {
  function start(baseDir) {
    connect.server({
      root: [baseDir],
      port: 3000,
      livereload: true
    });
  };

  gulp.task('connect', ['build'], function () {
    start(options.dist);
  });
};
