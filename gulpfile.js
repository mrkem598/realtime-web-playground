/**
 *
 *  Goodow Realtime Store
 *  Copyright 2014 Goodow.com. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: ['app']
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/css/**/*.css'], reload);
  gulp.watch(['app/js/**/*.js'], reload);
  gulp.watch(['app/images/**/*'], reload);
});

gulp.task('default', function() {
  // place code for your default task here
});