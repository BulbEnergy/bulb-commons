var gulp = require('gulp');
var typescript = require('gulp-tsc');
var runSequence = require('run-sequence');
var strip = require('gulp-strip-comments');
var del = require('del');
var tslint = require('gulp-tslint');
var path = require('path');
var tslint_config = require('./tslint.json');
var sass = require('gulp-sass');
var sassMaps = require('gulp-sourcemaps');
var refresh = require('gulp-livereload');

var config = {
    typings: './typing/tsd.d.ts',
    stopOnTSLint: true,
    tsLintReport: 'verbose',
    module : 'commonjs',
    compilationOutput: 'commons.js',
    compilationTarget: 'ES5',
    folders: {
        src: './src/',
        dist: './dist'
    }
};

gulp.task('lint', function () {
    gulp.src(config.folders.src + '/**/*.ts')
        .pipe(tslint(tslint_config))
        .pipe(tslint.report(config.tsLintReport, {
            emitError: config.stopOnTSLint
        }));
});

gulp.task('compile-ts', function () {
    gulp.src([config.typings, config.folders.src + '/commons.ts'])
        .pipe(typescript({
            module: config.module,
            target: config.compilationTarget,
            sourcemap: true,
            out: config.compilationOutput
        }))
        .pipe(strip())
        .pipe(gulp.dest(config.folders.dist));
});

gulp.task('watch', function () {
    config.stopOnTSLint = false;
    refresh.listen();
    gulp.watch(config.folders.src + '/**/*.ts', ['lint', 'compile-ts']);
    gulp.watch(config.folders.src + '/**/*.scss', ['lint', 'compile-sass']);
});

gulp.task('compile-sass', function () {
    gulp.src(config.folders.src + '/scss/commons.scss')
        .pipe(sassMaps.init())
        .pipe(sass())
        .pipe(sassMaps.write('./maps'))
        .pipe(gulp.dest(config.folders.dist));
});

gulp.task('default', function() {
    del.sync(config.folders.dist + '/*', {dot: false});
    runSequence('lint', 'compile-ts', 'compile-sass');
});
