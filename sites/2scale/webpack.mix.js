const mix = require("laravel-mix");

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

mix.js("resources/js/app.js", "public/js")
    .version()
    .js("resources/js/charts.js", "public/js")
    .version()
    .js("resources/js/rsrDatatables.js", "public/js")
    .version()
    .js("resources/js/util.js", "public/js")
    .version()
    .js("resources/js/main.js", "public/js")
    .version()
    .js("resources/js/database.js", "public/js")
    .version()
    .js("resources/js/main-home.js", "public/js")
    .version()
    .js("resources/js/home.js", "public/js")
    .version()
    .js("resources/js/organisation.js", "public/js")
    .version()
    .js("resources/js/partnership.js", "public/js")
    .version()
    .js("resources/js/reachreact.js", "public/js")
    .version()
    .js("resources/js/report.js", "public/js")
    .version()
    .js("resources/js/dexie.js", "public/js")
    .version()
    .js("resources/js/test.js", "public/js")
    .version()
    .sass("resources/sass/app.scss", "public/css")
    .version();

mix.styles(["resources/css/theme.css"], "public/css/all.css");

mix.copyDirectory("resources/vendor", "public/vendor");
mix.copyDirectory("resources/images", "public/images");
mix.copy("resources/favicon.ico", "public/");
mix.copyDirectory("resources/json", "public/json");

mix.styles(["resources/css/print.css"], "public/css/print.css");
mix.styles(
    ["resources/css/print-bootstrap.css"],
    "public/css/print-bootstrap.css"
);
