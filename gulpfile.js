var gulp = require('gulp');
var del = require('del'); //删除文件
var autoprefixer = require('gulp-autoprefixer'); //根据设置浏览器版本自动处理浏览器前缀
var htmlreplace = require('gulp-html-replace'); //在html里面替代构建块
var htmlmin = require('gulp-htmlmin'); //压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作
var concat = require("gulp-concat"); // 文件合并
var uglify = require('gulp-uglify'); //压缩javascript文件，减小文件大小
var imagemin = require('gulp-imagemin'); // 压缩图片
var rename = require('gulp-rename'); //重命名
var cleancss = require('gulp-clean-css'); //压缩css
var runSequence = require('run-sequence'); //同步执行任务


// 执行clean任务，删除dist目录下所有文件
gulp.task('Clean', function() {
    return del(['dist/**/*']);
});

//根据设置浏览器版本自动处理浏览器前缀
gulp.task('Autofixer', function () {
    return  gulp.src('css/print.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest('dist/css'));
});

//在html里面替代构建块
gulp.task('Htmlreplace', function() {
    return gulp.src(['*html', 'views/*.html'])
        .pipe(htmlreplace({
            'css': ['css/style.min.css', 'css/print.min.css'],
            'pizzacss': ['css/style.min.css', 'css/bootstrap-grid.min.css'],
            'js': 'js/perfmatters.min.js',
            'pizzajs': 'js/main.min.js'
        }))
        //.pipe(htmlreplace(options))
        .pipe(gulp.dest('build/'));
});

//压缩html
gulp.task('Htmlmin', function() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src(['*html', 'views/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

// 文件合并
gulp.task('Concat', function () {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'));
});

//压缩javascript文件，减小文件大小
gulp.task('Uglify', function () {
    //js目录下的所有js文件
    //**匹配js文件夹下的0个或多个子文件夹
    return gulp.src('js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//压缩图片
gulp.task('Imgmin', function (){
	return gulp.src(['img/*', 'views/images/*'])
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

//压缩css
gulp.task('Minifycss', function() {
    return gulp.src(['css/*.css', 'views/css/*.css'])
        .pipe(cleancss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

// 输出生产代码
gulp.task('default', function(cb) {
    // gulp的任务都是异步执行，htmlmin不会等到clean执行完后再执行
   runSequence('Clean', 'Autofixer', ['Htmlmin', 'Minifycss', 'Uglify', 'Concat', 'Imgmin', 'Htmlreplace'], cb);
});