const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
    {
    mode: 'production',
    entry: {
        main: './src/js/main.js',
    },
    output: {
        path: path.resolve(__dirname, './dist/js'),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: './src/images/',
            to:'./../images/'
        }])
    ]
}];
