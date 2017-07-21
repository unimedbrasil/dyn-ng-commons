// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('karma').Server;
var cleanCSS = require('gulp-clean-css');
var path = require('path');
var templateCache = require('gulp-angular-templatecache');
var cleanCSS = require('gulp-clean-css');

var config = {
    source: 'src',
    targetPath: 'dist',
    targetName: 'dyn-ng-commons',
    templateCacheOpts: {
        module: 'dyn-ng-commons'
    }
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(config.source + '/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
            config.source + '/**/*.module.js',
            config.source + '/**/*.js'
        ])
        .pipe(concat(config.targetName + '.js'))
        .pipe(gulp.dest(config.targetPath))
        .pipe(rename(config.targetName + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.targetPath));
});

// Concatenate & Minify HTML & put in templateCache
gulp.task('templates', function() {
    return gulp.src([
            config.source + '/**/*.html',
        ])
        .pipe(templateCache(config.targetName + '-tpls.js', config.templateCacheOpts))
        .pipe(gulp.dest(config.targetPath))
        .pipe(rename(config.targetName + '-tpls.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.targetPath));
});

// Concatena e minimifica os CSS
gulp.task('styles', function() {
    return gulp.src([
            config.source + '/**/*.css'
        ])
        .pipe(concatCss(config.targetName + '.css'))
        .pipe(gulp.dest(config.targetPath))
        .pipe(rename(config.targetName + '.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.targetPath));
});

gulp.task('test', ['scripts'], function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    });
});

// Default Task
gulp.task('default', ['lint', 'build', 'test']);

// Build Task
gulp.task('build', ['lint', 'scripts', 'templates', 'styles']);
