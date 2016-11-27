var gulp = require('gulp');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var rename = require('gulp-rename');
var filter = require('gulp-filter');

var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();

gulp.task('default', ['clean', 'build', 'serve']);
gulp.task('build', ['less']);


const mainStyleFilter = filter(['**/styles.css'], {
    restore: true
});
const mapsFilter = filter(['**/*.map'], {
    restore: true
});

gulp.task('serve', ['less'], () => {

    browserSync.init({
        server: true,
        injectChanges: true,
        open: "local",
        notify: false
    });

    gulp.watch('styles/**/*.less', ['less']);
    //gulp.watch('**/*.html').on('change', browserSync.reload);
});


gulp.task('less', () => {
    return buildStyles('styles/**/*.less')
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
})

function buildStyles(input) {

    const stream = gulp.src(input)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(sourcemaps.write('./maps', {
            includeContent: true,
            sourceRoot: '/less'
        }))
        .pipe(gulp.dest('./dist'))
    return stream;
}

/*

        .pipe(mainStyleFilter)
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(mainStyleFilter.restore)

 */
// gulp.task('watch', [], () => {

//     return watch('./styles/**/*.less', (file) => {
//         buildStyles(file.path);
//     })
// });



gulp.task('clean', [], () => {
    return gulp.src('./dist')
        .pipe(clean())
});
