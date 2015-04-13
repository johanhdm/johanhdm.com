var gulp = require('gulp')
    , sass = require('gulp-sass')
    , minify = require('gulp-minify-css')
    , rename = require('gulp-rename')
    , base64 = require('gulp-base64')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , del = require('del')
    , serve = require('gulp-serve')
    , jshint = require('gulp-jshint')
    , jscs = require('gulp-jscs')
    , plumber = require('gulp-plumber')
    , frontMatter = require('gulp-front-matter')
    , gulpsmith = require('gulpsmith')
    , permalinks = require('metalsmith-permalinks')
    , markdown = require('metalsmith-markdown')
    , templates = require('metalsmith-templates')
    , collections = require('metalsmith-collections')
    , assign = require('lodash.assign');

gulp.task('serve', serve('Dist'));

var base = ".";

//Paths configuration
var config = {
    "src": {
        "sass": [base + "/Source/css/app.scss", base + "/Source/css/print.scss"],
        "allSass": [base + "/Source/css/**/*.scss"],
        "js": [base + "/Source/js/lib/jquery-1.11.2/*.js",
              base + "/Source/js/lib/bootstrap-3.3.2/*.js",
              base + "/Source/js/lib/bootstrap-3.3.2/**/*.js",
              base + "/Source/js/lib/**/*.js",
              base + "/Source/js/app/**/*.js",
              ],
        "allJS" : [base + "/Source/js/**/*.*"],
        "images" : [ base + "/Source/images/**/*.*" ],
        "fonts" : [base + "/Source/fonts/**/*.*"],
        "html" : [base + "/Source/**/*.html"],
        "allHtml" : [base + "/Source/**/*.html", base + "/Source/**/*.hbt", ],
        "allMD" :  [base + "/Source/content/**/*"],
        "misc" : [base + "/Source/*.png", base + "/Source/robots.txt", base + "/Source/*.ico", base + "/Source/*.xml"]
    },
    "dest" : {
        "css" : base + "/Dist/css",
        "js": base + "/Dist/js",
        "images" : base + "/Dist/images",
        "fonts" : base + "/Dist/fonts",
        "html" : base + "/Dist",
        "server" : base + "/Dist",
        "root" : base + "/Dist"
    }
};


gulp.task('sass', function () {
    return gulp.src(config.src.sass)
        .pipe(plumber())
        .pipe(sass({ sourcemap: true }))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('forge', function(){
  gulp.src(config.src.allMD)
      .pipe(frontMatter()).on("data", function(file) {
        assign(file, file.frontMatter);
        delete file.frontMatter;
      })
      .pipe(
        gulpsmith()
          //.metadata({ site_name: "JohanHdM" })
          .use(collections({
            pages: {
                  pattern: 'pages/*.md'
            },
            blog: {
                pattern: 'posts/*.md',
                sortBy: 'date',
                reverse: true
            },
            work: {
                pattern: 'work/*.md',
            }
          }))
          .use(markdown())
          .use(permalinks({ pattern : ':collections/:slug' }))
          .use(templates({
                "engine" : "handlebars",
                "directory" : "Source/templates",
                "partials": {
                    "header": "partials/header",
                    "footer": "partials/footer"

                }
              }))


      )
      .pipe(gulp.dest(config.dest.html));
});

gulp.task('js', ['copy-js'], function () {
    return gulp.src(config.src.js)
        .pipe(plumber())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('copy-js', function(){
  return gulp.src(config.src.allJS)
    .pipe(plumber())
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('minify-css', ['sass'], function(){
    return gulp.src([config.dest.css + '/app.css'])
        .pipe(plumber())
        .pipe(base64({
          baseDir : config.dest.root
          }))
        .pipe(minify({ keepBreaks : true }))
        .pipe(rename({ suffix : '.min' }))
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('copy-images', function(){
  return gulp.src(config.src.images)
    .pipe(plumber())
    .pipe(gulp.dest(config.dest.images))
});

gulp.task('copy-fonts', function(){
  return gulp.src(config.src.fonts)
    .pipe(plumber())
    .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy-misc', function(){
  return gulp.src(config.src.misc)
    .pipe(plumber())
    .pipe(gulp.dest(config.dest.server));
});


gulp.task('clean', function(callback){
  del(config.dest.root, callback)
});

gulp.task('build', ['forge', 'sass', 'minify-css', 'copy-images', 'copy-fonts', 'copy-misc', 'js'], function () { });


gulp.task('server', function(){
  gulp.src(config.dest.server)
    .pipe(plumber())
    .pipe(webserver({
      port: 3000,
      livereload : false,
      directoryListing : true,
      open : true,
      fallback : 'index.html'
    }));
});

gulp.task('watch', function () {
    gulp.watch(config.src.allHtml, ['forge']);
    gulp.watch(config.src.allSass, ['sass', 'minify-css']);
    gulp.watch(config.src.allJS, ['js']);
    gulp.watch(config.src.allMD, ['forge']);
    gulp.watch(config.src.images, ['copy-images']);
    gulp.watch(config.src.fonts, ['copy-fonts']);

});

gulp.task('default', ['build', 'serve', 'watch'], function () { });
