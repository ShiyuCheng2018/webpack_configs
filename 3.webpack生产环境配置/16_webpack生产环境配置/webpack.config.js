const resolve = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


// 指定浏览器兼容模式(browserslist)， 定义nodejs环境变量
process.env.NODE_ENV = "production";


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

    entry: "./src/js/index.js",
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
    mode: "production"
};