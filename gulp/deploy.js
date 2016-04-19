var gulp = require('gulp');
var ftp = require('vinyl-ftp');



gulp.task('deploy:script',function(){
  var conn = ftp.create( {
        host:     '104.155.201.233',
        user:     'songkran',
        password: 'P@ssword',
        parallel: 5,
        log:      gutil.log
    } );
    return gulp.src([
      'dist/maps/**/*',
      'dist/scripts/**/*',
      'dist/styles/**/*',
      'dist/index.html'
    ],{ base: '.', buffer: false })
    .pipe(conn.dest('/echo'));
})
