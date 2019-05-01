const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: {
        fileupload.js: "./src/js/jquery.fileupload.js",
        transport.js: "./src/js/jquery.iframe-transport.js",
        knob.js: "./src/js/jquery.knob.js",
        widget.js: "./src/js/jquery.ui.widget.js",
        script: "./src/js/script.js",
    },
    output: {
        path: path.resolve(__dirname, "./dist/js"),
        filename: "[name].js",
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
}
