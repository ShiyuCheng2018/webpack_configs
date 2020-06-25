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
        // npx webpack-dev-server
        contentBase: resolve(__dirname, "build"),
        compress: true,
        port: 3000,
        open: true,
        // 开启HMR功能
        // 当修改了webpack配置， 新配置要想生效， 必须重启webpack服务
        hot: true
    },
    devtool: "source-map"
};

/*
*  source-map: 一种提供源代码到构建后代码映射对技术 (如果构建后代码出错了， 通过映射关系可以追踪到源代码错误)
*  [inline-|hidden-|eval-|][nosources-][cheap-[module-]]source-map
*
*   source-map: 外部
*       - 错误代码都准确信息和源代码都准确错误位置
*   inline-source-map: 内联
*       - 只生成一个内联到source-map
*       - 错误代码都准确信息和源代码都准确错误位置
*   eval-source-map： 内联
*       - 每一个文件都生成对应都source-map, 都在eval
*       - 错误代码错误原因， 但是没有错误位置，不能追踪到源代码到错误， 只有构建后到错误代码位置。
*   hidden-source-map： 外部
*       - 错误代码错误原因， 但是没有错误位置，不能追踪到源代码到错误， 只有构建后到错误代码位置。
*   nosources-source-map： 外部
*       - 提供错误代码准确信息， 但是没有任何源代码信息
*   cheap-source-map： 外部
*       - 提供代码错误信息， 但是只能精确到源代码行
*   cheap-module-source-map： 外部
*       - 提供代码错误信息， 但是只能精确到源代码行
*       - module会将loader到source map加入进来
*
*   内联 和 外部到区别： 1， 外部生产了文件， 内联没有。 2， 内联构建到速度更快
*
*   开发环境： 速度快， 调试更友好
*       - 速度： eval > inline > cheap > ...
*               eval-cheap-source-map > eval-source-map 速度叠加
*       - 调试： source map > cheap-module-source-map > cheap-source-map
*       --> 最优： eval-source-map ｜ eval-cheap-module-source-map
*   生产环境： 源代码是否隐藏？ 调试是否需要友好？
*       内联会使代码体积变大， 所以在生产环境下， 内联需要排除
*       - 隐藏源代码： nosources-source-map (全部隐藏) | hidden-source-map（只隐藏源代码， 会提示构建后代码错误信息）
*       --> 最优： source-map ｜ cheap-module-source-map
* */