const path = require('path');

module.exports = {
    mode: "production",
    entry: ["./src/js/main.js", "./src/js/template.js"],
    output: {
        path: path.resolve(__dirname, "./static/js"),
        filename: "all.js"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },{
            test: /\.(png|jpg|gif|svg)$/,
            use: ['file-loader']
        },{
            test: /\.(woff|woff2|eot|ttf)$/,
            use: ['file-loader']
        }]
    }
}
