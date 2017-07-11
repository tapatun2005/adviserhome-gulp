const folder = "stellars";
const imagePath = "/cd-content/uploads/images/";


const gulp = require('gulp'),
	gcmq = require('gulp-group-css-media-queries'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync').create(),
	fs = require("fs"),
	replace = require('gulp-replace'),
	environments = require('gulp-environments'),
	argv = require('yargs').argv,
	gulpif = require('gulp-if'),
	path = require('path');

var dirs = getDirectories('source');

gulp.task('default', ['compile', 'watch', 'server']);
gulp.task('compile', ['templates','styles', 'images']);

gulp.task('templates', function(){

	for(let i = 0; i < dirs.length; i++){
		let template = 
		gulp.src('source/'+dirs[i]+'/templates/*.pug')
		.pipe(pug());


		template.pipe(gulp.dest('build/'+dirs[i]))
			.pipe(gulpif(argv.production, replace('/images/', imagePath)))
			.pipe(gulpif(argv.production, gulp.dest('build/'+dirs[i]+"/prod/")));
	}

});

gulp.task('styles', function(){
	for(let i = 0; i < dirs.length; i++){
		let style = 
			gulp.src('source/'+dirs[i]+'/sass/*.scss')
			.pipe(sass())
			.pipe(autoprefixer({
		            browsers: ['last 2 versions'],
		            cascade: false
		        }))
			.pipe(gcmq())
			.pipe(cssnano());

		style.pipe(gulp.dest('build/'+dirs[i]+'/css/'))
			.pipe(gulpif(argv.production, replace('/images/', imagePath)))
			.pipe(gulpif(argv.production, gulp.dest('build/'+dirs[i]+"/prod/css/")))
	}
});

gulp.task('images', function(){
	for(let i = 0; i < dirs.length; i++){
		let images = gulp.src("source/"+dirs[i]+"/images/*")
		.pipe(imagemin());
		images.pipe(gulp.dest("build/"+dirs[i]+"/images/"));
	}
})

gulp.task('watch', function(){
	gulp.watch('source/**/sass/*.scss', ["styles"]);
	gulp.watch('source/**/templates/*.pug', ["templates"]);
	gulp.watch('source/**/images/*', ["images"]);
})

gulp.task('server', ['compile'], function () {
  return browserSync.init(['build/**/js/*.js', 'build/**/css/*.css', 'build/**/index.html', 'build/**/images/*'], {
    server: {
      baseDir: './build/'
    }
  });
});

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}