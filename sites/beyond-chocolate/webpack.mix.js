const mix = require("laravel-mix");

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

mix.react("resources/js/app.js", "public/js").sass(
    "resources/sass/app.scss",
    "public/css"
);
mix.sourceMaps(); // Enable sourcemaps
mix.copyDirectory("resources/images", "public/images");

mix.webpackConfig({
    devServer: {
        host: "0.0.0.0"
    }
});
