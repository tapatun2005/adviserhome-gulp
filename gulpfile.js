const folder = "si-hermes";
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
	path = require('path'),
	reload = browserSync.reload,
	plumber = require('gulp-plumber'),
	runSequence = require('run-sequence');

var dirs = getDirectories('source');

gulp.task('default', function(callback){
	runSequence('compile', 'watch', 'server', callback)
});
gulp.task('compile', ['templates','styles', 'images']);      

gulp.task('templates', function(){
		gulp.src('source/'+folder+'/templates/*.pug')
		.pipe(plumber())
		.pipe(pug())


		.pipe(gulp.dest('build/'+folder))
			.pipe(gulpif(argv.production, replace('/images/', imagePath)))
			.pipe(gulpif(argv.production, gulp.dest('build/'+folder+"/prod/")));
});

gulp.task('styles', function(){
		gulp.src('source/'+folder+'/sass/*.scss')
			.pipe(plumber())
			.pipe(sass())
			.pipe(autoprefixer({
		            browsers: ['last 2 versions'],
		            cascade: false
		        }))
			.pipe(gcmq())
			.pipe(cssnano())

		.pipe(gulp.dest('build/'+folder+'/css/'))
			.pipe(plumber())
			.pipe(gulpif(argv.production, replace('/images/', imagePath)))
			.pipe(gulpif(argv.production, gulp.dest('build/'+folder+"/prod/css/")));
});

gulp.task('images', function(){
	//for(let i = 0; i < dirs.length; i++){
		gulp.src("source/"+folder+"/images/*")
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest("build/"+folder+"/images/"));
	//}
})

gulp.task('watch', function(){
	gulp.watch('./source/'+ folder +'/sass/*.scss', ["styles"]);
	gulp.watch('./source/'+ folder +'/templates/**/*.pug', ["templates"]);
	gulp.watch('./source/'+ folder +'/images/*', ["images"]);
})

gulp.task('server', function () {
  return browserSync.init(["./build/**/*"], {
    server: {
      baseDir: './build/'+folder
    }
  });
});

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}