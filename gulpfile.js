const 	gulp 		= require('gulp'),
		less 		= require('gulp-less'),
		concatJs 	= require('gulp-concat'),
		concatCss 	= require('gulp-concat-css'),
		cleanCss 	= require('gulp-clean-css'),
		prefixer 	= require('gulp-autoprefixer'),
		uglify 		= require('gulp-uglify'),
		del 		= require('del');

function buildStyles() {
	return gulp.src(['src/styles/*.css', 'src/styles/less/*.less' ])
		.pipe(less())
		.pipe(concatCss('styles.css'))
		.pipe(prefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCss())
		.pipe(gulp.dest('dist/css/'))
};

function buildScripts() {
	return gulp.src('src/scripts/*.js')
		.pipe(concatJs('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'))
};

let copyPages 	= () => gulp.src(['src/*.html', 'src/*.htm']).pipe(gulp.dest('dist/')),
	copyFonts 	= () => gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts')),
	copyImages 	= () => gulp.src('src/images/**/*').pipe(gulp.dest('dist/images')),
	copyLibCss 	= () => gulp.src('src/styles/libs/*').pipe(gulp.dest('dist/css/libs')),
	copyLibJs 	= () => gulp.src('src/scripts/libs/*').pipe(gulp.dest('dist/js/libs')),
	clean 		= () => del(['dist/*']);

gulp.task('styles', 	buildStyles);
gulp.task('scripts', 	buildScripts);

gulp.task('default', gulp.series(
	clean, 
	buildStyles, 
	buildScripts,
	copyPages, 
	copyLibCss,
	copyLibJs,
	copyFonts, 
	copyImages
));