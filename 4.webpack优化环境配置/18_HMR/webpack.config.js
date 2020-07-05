/*
* HMR: hot module replacement 热模块替换 / 模块热替换
*   作用： 一个模块发生变化， 只会重新打包这一个模块（而不是打包所有）
*       极大地提升构建速度
*       样式文件： 可以使用HRM功能： 因为style-loader内部实现了
*       JS文件： 默认不能使用HMR功能 --> 需要修改js代码， 添加支持HMR功能当代码
*                  if(module.hot){
*                       // 一旦module.hot为true， 说明开启了HMR功能。 --> 让HMR功能代码生效
*                       module.hot.accept('./print.js', function(){
*                           // 方法会监听print.js文件当变化， 一旦发生变化， 其他默认不会重新打包构建。
*                           // 会执行后面当回调函数
*                           print()
*                       })
*                   }
*               注意： HMR功能对js对处理， 只能处理非入口js文件对其他文件。只能对入口文件对依赖文件做HMR
*       HTML文件： 默认不能使用HMR功能， 同时会导致问题： html不能热更新, 没有重新刷新浏览器。 （不需要HMR功能）
*           解决： 修改entry入口， 将html文件引入， 依然没有HMR功能（不需要， 因为只有一个index.html。）
* */

const resolve = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


// 指定浏览器兼容模式(browserslist)， 定义nodejs环境变量
process.env.NODE_ENV = "development";


// 复用css loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
        // css兼容性处理, 并在package.json中定义所需兼容浏览器
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            plugins: ()=>[require("postcss-preset-env")()]
        }
    }
];

module.exports = {

    entry: [ "./src/js/index.js", "./src/index.html"],
    output: {
        filename: "js/built.js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.less$/,
                use: [
                    ...commonCssLoader,
                    "less-loader"
                ]
            },
            /*
            * 正常情况下， 一个文件只有一个loader去处理， 当一个文件要被多个loader去处理， 那么需要
            * 明白文件对处理顺序。 现执行eslint， 之后进行babel。
            * */
            {
                // 在package.json中eslintConfig需要指定检查 -- airbnb
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "eslint-loader",
                options: {
                    fix: true
                }
            },
            {
                // 对js进行浏览器兼容性处理
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env",
                            {
                                useBuiltIns: "usage",
                                corejs: {version: 3},
                                targets: {
                                    chrome: "60",
                                    firefox: "50",
                                }
                            }
                        ]
                    ]
                }
            },
            {
                // 处理图片
                test: /\.(jpg|png|gif)/,
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    name: "[hash:10].[ext]",
                    outputPath: "images",
                    esModule: false
                }
            },
            {
                // 处理html里面的图片
                test: /\.html$/,
                loader: "html-loader",
            },
            {
                exclude: /\.(js|css|less|html|jpg|png|gif)/,
                loader: "file-loader",
                options: {
                    outputPath: "media"
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/built.css"
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    mode: "development",
    devServer: {
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
        // 开启HMR功能
        // 当修改了webpack配置， 新配置要想生效， 必须重启webpack服务
        hot: true
    }
};