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
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    // 生产环境下自动压缩代码
    mode: "production"
};
