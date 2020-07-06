const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sitemap = require('gulp-sitemap');
const del = require('del');

const paths = {
  src: 'src',
  dest: 'dest'
};

//Pug
gulp.task('html', function() {
  return gulp.src([
    paths.src + '/pug/**/*.pug',
    '!' + paths.src + '/pug/**/_*.pug'
  ])
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(pug({pretty: true}))
  .pipe(gulp.dest(paths.dest))
});

//Sass
gulp.task('sass', function() {
  return gulp.src([
    paths.src + '/sass/**/*.sass',
    '!' + paths.src + '/sass/**/_*.sass'
  ])
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(cssmin())
  .pipe(gulp.dest(paths.dest + '/css'))
});

gulp.task('css', function() {
  return gulp.src(
    paths.src + '/css/**/*'
  )
  .pipe(gulp.dest(paths.dest + '/css'))
});

//JavaScript
gulp.task('js', function() {
  return gulp.src(
    paths.src + '/js/**/*'
  )
  .pipe(uglify())
  .pipe(gulp.dest(paths.dest + '/js'))
});

//Image File
gulp.task('image', function() {
  return gulp.src(
    paths.src + '/img/**/*'
  )
  .pipe(gulp.dest(paths.dest + '/img'))
});

gulp.task('sitemap', function() {
  return gulp.src(
    paths.dest + '/*.html', {
      read: false
    })
  .pipe(sitemap({
    siteUrl: 'https://doto-kai.com/draft'
  }))
  .pipe(gulp.dest(paths.dest))
});

//Browser Sync
gulp.task('browser-sync', function (done) {
  browsersync({
    server: { //ローカルサーバー起動
        baseDir: paths.dest
  }});
  done();
});

//Watch
gulp.task('watch', function () {
  const reload = () => {
    browsersync.reload(); //リロード
  };
  gulp.watch(paths.src + '/sass/**/*').on('change', gulp.series('sass', reload));
  gulp.watch(paths.src + '/pug/**/*').on('change', gulp.series('html', reload, 'sitemap'));
  gulp.watch(paths.src + '/js/**/*').on('change', gulp.series('js', reload));
  gulp.watch(paths.src + '/img/**/*').on('change', gulp.series('image', reload));
});

//Clean
gulp.task('clean', function(done) {
  del.sync(paths.dest + '/**', '！' + paths.dest);
  done();
});

//Default
gulp.task('default',
  gulp.series(
  'clean',
  'html',
  'sitemap',
  gulp.parallel(
    'sass',
    'css',
    'js',
    'image',
    'watch',
    'browser-sync'
  )
));