let mix = require('laravel-mix');

require('laravel-mix-bundle-analyzer');

if (!mix.inProduction()) {
    mix.bundleAnalyzer();
}

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

mix.js([
    'resources/assets/js/bootstrap.js',
    ], 'public/js/app.js')
    .js([
    'resources/assets/js/cluster.js',
    'resources/assets/js/maps.js',
    ], 'public/js/maps.js')
    .js([
    'resources/assets/js/database.js',
    ], 'public/js/database.js')
    .js([
    'resources/assets/js/charts.js',
    ], 'public/js/charts.js')
    .babel('resources/assets/js/global.js', 'public/js/global.js')
    .babel('resources/assets/js/visualization.js', 'public/js/visualization.js')
    .babel('resources/assets/js/demo.js', 'public/js/demo.js')
    .scripts('resources/assets/js/vendors/echarts.min.js', 'public/js/vendors/echarts.min.js')
    .scripts('resources/assets/js/vendors/datatables.min.js', 'public/js/vendors/datatables.min.js')
    .scripts('resources/assets/js/vendors/d3.v3.min.js', 'public/js/vendors/d3.v3.min.js')
    .scripts('resources/assets/js/vendors/lodash.min.js', 'public/js/vendors/lodash.min.js')
    .styles('node_modules/@fortawesome/fontawesome-free/css/all.min.css', 'public/vendor/fontawesome/css/all.min.css')
    .scripts('node_modules/js-cache/bundle/cache.js', 'public/vendor/cache-js/cache.js')
    .copy('node_modules/@fortawesome/fontawesome-free/webfonts/', 'public/vendor/fontawesome/webfonts/')
    .copy('resources/assets/excel/databases_clean.csv', 'public/excel/databases_clean.csv')
    .copy('resources/assets/images/', 'public/images/')
    .copy('node_modules/leaflet/dist/', 'public/vendor/leaflet/')
    .copy('resources/assets/json/config.json', 'public/config.json')
    .copy('resources/assets/json/geojson.json', 'public/geojson.json')
    .copy('resources/assets/json/rgeojson.json', 'public/rgeojson.json')
    .copy('resources/assets/json/all-countable.json', 'public/all-countable.json')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .version();

