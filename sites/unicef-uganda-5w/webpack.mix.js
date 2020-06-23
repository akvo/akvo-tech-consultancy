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

mix.react('resources/js/app.js', 'public/js')
    .styles('resources/sass/custom.css', 'public/css/all.css')
    .sass('resources/sass/app.scss', 'public/css');

mix.copyDirectory('resources/images', 'public/images');

/*
mix.browserSync({
    proxy: 'covid-kenya.localhost',
    files: ['public/css/*.css','public/js/*.js'],
    notify: false
});
*/
