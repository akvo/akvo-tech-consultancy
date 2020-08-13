const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
/*
require('laravel-mix-bundle-analyzer');
if (mix.isWatching()) {
    mix.bundleAnalyzer();
}
 */


mix.react('resources/js/app.js', 'public/js')
    .styles(['resources/sass/custom.css'], 'public/css/all.css')
    .sass('resources/sass/app.scss', 'public/css');

mix.copyDirectory('resources/images','public/images')
mix.copyDirectory('resources/fonts','public/fonts')
mix.copyDirectory('resources/json','public/json')


// mix.browserSync('unep.localhost');
