<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('/word', function () {
    return view('test');
});

Route::get('generate-docs', function(){
    $headers = array(
        "Content-type"=>"text/html",
        "Content-Disposition"=>"attachment;Filename=myfile.doc"
    );
    $content = '<html>
            <head><meta charset="utf-8"></head>
            <body>
                <p>My Content</p>
                <ul><li>Cat</li><li>Cat</li></ul>
            </body>
            </html>';
    return \Response::make($content,200, $headers);
});

Route::get('/example', 'Docs\DocumentController@test');
