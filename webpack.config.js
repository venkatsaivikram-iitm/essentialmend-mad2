const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const env = process.env.NODE_ENV;

module.exports = {
    mode: "production",
    entry: {
        main: './client/main.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'static/js'),
        publicPath: 'static/js/'
    },
    module: {
    rules: [
        {
            test: /\.vue$/,
            use: 'vue-loader'
        },
        {
            test: /\.js$/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        }
    ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
            chunkFilename: '../css/[id].css'
        })
    ]
};
