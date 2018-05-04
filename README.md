# gulp-starter-kit


## Usage
### Install
    npm install

## Tasks
----
### BUILDING
----
#### Default task
Builds the project and store it into `./dist/`
```bash
gulp
```
```js
gulp.task('default', ['css', 'js', 'pug'], function() {});
```
----
#### Development mode
Launches server on localhost:3000 with BrowserSync and directory listing, reloads the page on each change of `*.pug`, `*.scss`, `*.js`
```bash
gulp serve
```
```js
gulp.task('serve', ['default', 'css:watch', 'js:watch', 'pug:watch'],function(){
    bs.init({
        server: {
            baseDir: 'src/html',
            directory: true
        },
    });
    gulp.watch(['./src/style.css', './src/script.js', './src/**/*.html']).on('change', bs.reload);
});
```
----
### STYLES
----
#### SCSS
Compiles your sass files from `./src/scss/**/*.scss` to `./src/css`
```bash
gulp scss
```
```js
gulp.task('scss', function() {
    return gulp.src('./src/scss/**/*.scss')
           .pipe(sass().on('error', sass.logError))
           .pipe(gulp.dest('./src/css'));
});
```
----
#### Concat for CSS
Concatenate css files from `./src/css/` to single `./src/style.css` file  
(according to the sequence you defined in `var folders` variable)
```bash
gulp concat:css
```
```js
gulp.task('concat:css', function() {
    var folders = [
        './src/css/helpers/**/*.css',
        './src/css/blocks/**/*.css'
    ];
    return gulp.src(folders)
           .pipe(concat('style.css'))
           .pipe(gulp.dest('./src/'));
});
```
----
#### Minify for CSS
Minifies your `./src/style.css` and puts it to `./dist/style.css`
```bash
gulp minify:css
```
```js
gulp.task('minify:css', function() {
    return gulp.src('./src/style.css')
           .pipe(cleanCSS())
           .pipe(gulp.dest('./dist/'))
});
```
----
#### CSS
Combines `gulp scss`, `gulp concat:css`, `minify:css` in one task and run them synchronously
```bash
gulp css
```
```js
gulp.task('css', gulpSequence('scss', 'concat:css', 'minify:css'));
```
----
#### Watch for CSS
Watches for changes in your `scss/**/*.scss` and `css/**/*.css` files in `./src/` folder and rebuild `./src/styles.css` on each change
```bash
gulp css:watch
```
```js
gulp.task('css:watch', function(){
    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/css/**/*.css', ['concat:css']);
});
```
----
### SCRIPTS
----
#### Concat for JS
Concatenate all `*.js` files from `./src/js/` to single `./src/script.js` file
```bash
gulp concat:js
```
```js
gulp.task('concat:js', function() {
    return gulp.src('./src/js/**/*.js')
           .pipe(concat('script.js'))
           .pipe(gulp.dest('./src/'));
});
```
----
#### Minify for JS
Minifies your `./src/script.js` and puts into two files `./dist/script.js` and `./dist/script-min.js`
```bash
gulp minify:js
```
```js
gulp.task('minify:js', function() {
    return gulp.src('./src/script.js')
           .pipe(minify())
           .pipe(gulp.dest('./dist/'))
});
```
----
#### JS
Combines `gulp concat:js`, `minify:js` in one task and run them synchronously
```bash
gulp js
```
```js
gulp.task('js', gulpSequence('concat:js', 'minify:js'));
```
----
#### Watch for JS
Watches for changes in your `js/**/*.js` files in `./src/` folder and rebuild `./src/script.js` on each change
```bash
gulp js:watch
```
```js
gulp.task('js:watch', function(){
    gulp.watch('./src/js/**/*.js', ['concat:js']);
});
```
----
### TEMPLATES
----
#### PUG
Compiles your `*.pug` files from `./src/pug` to `./src/html` and `./dist/html` folders
```bash
gulp pug
```
```js
gulp.task('pug', function(){
    return gulp.src('./src/pug/**/*.pug')
           .pipe(pug())
           .pipe(gulp.dest('./src/html'))
           .pipe(gulp.dest('./dist/html'))
});
```
----
#### Watch for PUG
Watches for changes `./src/pug/**/*.pug` and run `gulp pug` on each change
```bash
gulp js:watch
```
```js
gulp.task('pug:watch', function(){
    gulp.watch('./src/pug/**/*.pug', ['pug']);
});
```
----