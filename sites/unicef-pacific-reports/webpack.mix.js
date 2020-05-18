const mix = require('laravel-mix');

require('laravel-mix-svelte');

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

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .svelte();

mix.copyDirectory('resources/images', 'public/images');

mix.js('resources/js/word.js', 'public/js')
    .sass('resources/css/word.scss', 'public/css');
