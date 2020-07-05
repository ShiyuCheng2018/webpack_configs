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
            /* 为了规范团队代码进行语法检查， 检查常见语法错误及格式风格：eslint-loader eslint
            注意： 只检查自己写的源代码， 并不检查第三方库代码
            设置检查规则： package。json中eslintConfig中设置， 常用规则为airbnb规则
            airbnb --> eslint-loader eslint  eslint-config-airbnb-base eslint-plugin-import
            * */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    fix: true
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
