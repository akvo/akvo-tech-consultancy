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

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/main.js', 'public/js')
    .js('resources/js/database.js', 'public/js')
    .js('resources/js/charts.js', 'public/js')
    .js('resources/js/organisation.js', 'public/js')
    .js('resources/js/rnr.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css');

mix.styles([
    'resources/css/theme.css',
],  'public/css/all.css');

mix.copyDirectory('resources/vendor', 'public/vendor');
mix.copyDirectory('resources/images', 'public/images');
mix.copyDirectory('resources/json', 'public/json');
