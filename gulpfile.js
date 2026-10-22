var gulp         = require('gulp');
var sass         = require('gulp-sass')(require('sass'));
var plugins      = require('./gulp/plugins');
var bs           = require('browser-sync').create();

gulp.task('scss', function() {
    return gulp.src('./src/scss/style.scss')
           .pipe(sass().on('error', sass.logError))
           .pipe(gulp.dest('./src'));
});
gulp.task('minify:css', function() {
    return gulp.src('./src/style.css')
           .pipe(plugins.minifyCss())
           .pipe(gulp.dest('./dist/'))
});
gulp.task('css', gulp.series('scss', 'minify:css'));
gulp.task('css:watch', function(){
    return gulp.watch('./src/scss/**/*.scss', gulp.series('scss'));
});

gulp.task('concat:js', function() {
    return gulp.src('./src/js/**/*.js')
           .pipe(plugins.concat('script.js'))
           .pipe(gulp.dest('./src/'));
});
gulp.task('minify:js', function() {
    return gulp.src('./src/script.js')
           .pipe(plugins.minifyJs())
           .pipe(gulp.dest('./dist/'))
});
gulp.task('js', gulp.series('concat:js', 'minify:js'));
gulp.task('js:watch', function(){
    return gulp.watch('./src/js/**/*.js', gulp.series('concat:js'));
});

gulp.task('pug', function(){
    return gulp.src('./src/pug/**/*.pug')
           .pipe(plugins.pug())
           .pipe(gulp.dest('./src/html'))
           .pipe(gulp.dest('./dist/html'))
});
gulp.task('pug:watch', function(){
    return gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));
});

gulp.task('default', gulp.parallel('css', 'js', 'pug'));

gulp.task('serve', gulp.series('default', gulp.parallel('css:watch', 'js:watch', 'pug:watch', function(){
    bs.init({
        server: {
            baseDir: './',
            directory: true
        },
    });
    return gulp.watch(['./src/style.css', './src/script.js', './src/**/*.html']).on('change', bs.reload);
})));
