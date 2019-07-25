const path = require("path");
const webpack = require("webpack");

module.exports = {
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    mode: "production",
    entry: {
        main:"./src/app.js"
    },
    output: {
        path: path.resolve(__dirname, "./static/js"),
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    },
};
