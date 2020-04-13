const { series } = require("gulp");
const { src, dest } = require("gulp");
const { watch } = require('gulp');
const fask = null; // 是否进行压缩
// 文件目录
const folder = {
    src: "src/",
    dist: "dist/"
}
// 判断当前环境变量 如果处于开发环境不进行压缩，反之压缩
const devMod = process.env.NODE_ENV == "development";
// export NODE_ENV=development 设置环境变量

// 引入插件
const htmlclean = require("gulp-htmlclean"); // 压缩HTML
const imagemin = require("gulp-imagemin"); // 压缩图片
const uglify = require("gulp-uglify"); // 压缩js
const stripDebug = require("gulp-strip-debug"); // 去掉js中的调试语句
const cleancss = require("gulp-clean-css"); // 压缩css
const less = require("gulp-less"); // 将less文件解析成css文件
const postcss = require("gulp-postcss"); // 给css3属性添加前缀
const autoprefixer = require("autoprefixer"); // 辅助添加前缀参数
const connect = require("gulp-connect"); // 开启本地服务器

// html文件处理函数
function html() {
    return src(folder.src + "html/*")
        .pipe(connect.reload())
        // .pipe(htmlclean())
        .pipe(dest(folder.dist + "html/"));
};

// css文件处理函数
function css() {
    return src(folder.src + "css/*")
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postcss([autoprefixer()]))
        // .pipe(cleancss())
        .pipe(dest(folder.dist + "css/"));
};

// js文件处理函数
function js() {
    return src(folder.src + "js/*")
        .pipe(connect.reload())
        // .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(dest(folder.dist + "js/"));
};

// 图片文件处理函数
function image() {
    return src(folder.src + "image/*")
        .pipe(imagemin())
        .pipe(dest(folder.dist + "image/"));
}

// 开启服务器函数
function server() {
    connect.server({
        root: './',
        port: 8888,
        livereload: true,
        host: '::'
    });
}

// 监听文件更改时运行任务
watch(folder.src + "html/*", html);
watch(folder.src + "css/*", css);
watch(folder.src + "js/*", js);

// exports.html = html;
exports.default = series(html, css, js, image, server, watch);