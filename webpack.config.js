const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: {
        app: path.join(__dirname, 'app', 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            test: /.js(x?)$/,
            loader: ['babel-loader', 'eslint-loader'],
            exclude: [
                path.join(__dirname, 'node_modules')
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'app', 'index.html')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host: 'localhost',
        port: 3000,
        inline: true,
        overlay: {
            errors: true
        },
    }
}