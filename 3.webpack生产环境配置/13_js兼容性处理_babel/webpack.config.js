// webpack is based on Nodejs
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: {
        index: "./src/js/index.js",
    },
    output: {
        path: path.resolve(__dirname, "built"),
        filename: "js/build.js"
    },
    module: {
        rules: [
            /*
                JS兼容性处理： babel-loader @babel/core @babel/preset-env
                1. 基本的JS兼容性处理 -->  @babel/preset-env
                    问题： 只能转换基本语法, 如promise等高级语法不能被转换
                2. 全部JS兼容性处理 --> @babel/polyfill
                    问题：引入全部兼容性代码包括不必要兼容性， 造成大体积
                3. 按需做兼容性处理：按需加载 --> core.js
            * */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    // 告诉babel去做哪些兼容性处理
                    presets: [
                        ["@babel/preset-env",
                            {
                                // 按需下载
                                useBuiltIns: "usage",
                                // 指定core-js版本
                                corejs: {
                                    version: 3
                                },
                                // 指定兼容性做到哪个版本浏览器
                                targets: {
                                    chrome: '60',
                                    firefox: "60",
                                    ie: "9",
                                    safari: "10",
                                    edge: "17"
                                }
                            }
                        ]

                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    mode: "development"
};
