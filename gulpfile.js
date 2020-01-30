var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    changed = require('gulp-changed'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    path = require('path');


gulp.task('js', function () {
    return gulp.src([
            //'app/libs/owl/owl.carousel.min.js',
            'app/js/main.js' // Всегда в конце
        ])
        .pipe(concat('scripts.min.js'))
        // .pipe(uglify()) // Минимизировать весь js (на выбор)
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('less', function () {
    return gulp.src('app/less/**/style.less')
        .pipe(less())
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS()) //сжатие файла
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function (done) {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });

    browserSync.watch('dist/').on('change', browserSync.reload);

    done()
});

gulp.task('imagemin', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});


gulp.task('watch', gulp.parallel('less', 'js', 'browser-sync', 'html', 'imagemin', 'fonts', function () {
    gulp.watch('app/less/*.less', gulp.parallel('less'));
    gulp.watch(['libs/**/*.js', 'app/js/main.js'], gulp.parallel('js'));
    gulp.watch('app/img/**/*', gulp.parallel('imagemin'));
    gulp.watch('app/*.html', gulp.parallel('html'), browserSync.reload);
}));

gulp.task('clean', function () {
    return del('dist');
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('imagemin', 'less', 'js', 'html', 'fonts')));

gulp.task('default', gulp.parallel('watch'));