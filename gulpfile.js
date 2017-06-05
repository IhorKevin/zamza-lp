var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    axis = require('axis'),
    stylus = require('gulp-stylus'),
    prefix = require('gulp-autoprefixer');

function wrapPipe(taskFn) {
    return function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        };
        var outStream = taskFn(onSuccess, onError);
        if(outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

gulp.task('css', wrapPipe(function (success, error) {
    return gulp.src(['styl/main.styl'])
        .pipe(stylus({
            compress: true,
            use: [axis()]
        }).on('error', error))
        .pipe(prefix({
            browsers: ['last 2 versions', 'ie >= 11']
        }))
        .pipe(rename('main.min.css').on('error', error))
        .pipe(gulp.dest('css'));
}));

gulp.task('js', wrapPipe(function(success, error) {
    return gulp.src('js/src/*.js')
        .pipe(uglify().on('error', error))
        .pipe(concat('main.min.js').on('error', error))
        .pipe(gulp.dest('js/'));
}));

gulp.task('watch', function () {
    gulp.watch('styl/*.styl', ['css']);
    gulp.watch('js/src/*.js', ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);
