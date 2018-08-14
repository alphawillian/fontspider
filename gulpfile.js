let gulp = require('gulp')
let fs = require('fs')
let gulpSequence = require('gulp-sequence')
let browserSync = require('browser-sync')
let fontSpider = require('gulp-font-spider')
let watcherHtml = gulp.watch('html/*.html', ['fontspider'])
let watcherCss = gulp.watch('css/*.css', ['fontspider'])
let utils = {
  // 删除文件夹
	deleteDir: function(path) {
		var _this = this;
		var files = [];
		if (fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function(file, index) {
				var curPath = path + "/" + file;
				if (fs.statSync(curPath).isDirectory()) { // recurse
					_this.deleteDir(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
}
gulp.task('server', function() {
  let files = [
    'html/*.html',
    'css/*.css'
  ];
  browserSync.init(files, {
    server: {
      baseDir: './',
      directory: true,
      https: false
    },
    port: 8888
  })
})
gulp.task('fontspider', function() {
  return gulp.src('./html/*.html')
              .pipe(fontSpider())
})
// 将字体输出到build目录下
gulp.task('distFont', function() {
  gulp.src(['./font/*.ttf', './font/*.woff'])
			.pipe(gulp.dest('./build'))
})
// 删除build目录
gulp.task('deleteBuild', function() {
  utils.deleteDir('build')
})

gulp.task('dev',['fontspider','server'])
gulp.task('build', function(cb){
  gulpSequence('deleteBuild','distFont', cb);
})