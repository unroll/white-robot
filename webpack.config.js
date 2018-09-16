const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const development = true;
module.exports = {
    mode: development ? 'development' : 'production',
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
                test: /\.js(x?)$/,
                use: ['babel-loader', 'eslint-loader'],
                exclude: path.join(__dirname, 'node_modules')
            },
            {
                test: /\.css$/,
                use: [
                    development ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')]
                        }
                    }
                ],
                exclude: [
                    path.join(__dirname, 'node_modules')
                ]
            },
            {
                test: /\.jpe?g|png|svg|webp$/,
                use: { loader: 'url-loader', options: { limit: 8192 } }
            },
            {
                test: /\.jpe?g|png|webp|gif$/,
                loader: 'file-loader',
                exclude: path.join(__dirname, 'node_modules'),
                options: {
                    name: 'assets/[name].[hash:8].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'app', 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(path.join(__dirname, 'dist'))
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host: 'localhost',
        port: 3000,
        inline: true,
        hot: true,
        overlay: {
            errors: true
        },
        open: true
    }
};