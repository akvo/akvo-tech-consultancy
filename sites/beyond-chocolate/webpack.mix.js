const mix = require("laravel-mix");
require('laravel-mix-transpile-node-modules');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

if (mix.inProduction()) {
    mix.transpileNodeModules()
}

mix.react("resources/js/app.js", "public/js")
    .babel(["public/js/app.js"], 'public/js.app.es5.js')
    .sass("resources/sass/app.scss","public/css");
mix.sourceMaps(); // Enable sourcemaps
mix.copyDirectory("resources/images", "public/images");

mix.webpackConfig({
    devServer: {
        host: "0.0.0.0"
    }
});
