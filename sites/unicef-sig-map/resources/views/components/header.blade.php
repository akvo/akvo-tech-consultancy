<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="author" content="Akvo">
    <title>SIG-WASH</title>
    <link rel="icon" href="{{asset('images/solomon-island-ico.ico')}}">
    <link href="{{asset(mix('css/app.css'))}}" rel="stylesheet">
    <link href="{{asset('vendor/leaflet/leaflet.css')}}" rel="stylesheet">
    <link href="{{asset('vendor/fontawesome/css/all.min.css')}}" rel="stylesheet">
    <script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script scr="https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js"></script>
</head>
