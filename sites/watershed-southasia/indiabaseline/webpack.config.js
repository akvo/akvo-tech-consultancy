const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    watch: true,
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
    plugins: [
        new CopyPlugin([{
                from: 'src/data/',
                to: 'data'
            },
            {
                from: 'src/images/',
                to: 'images'
            },
        ]),
    ]
}
