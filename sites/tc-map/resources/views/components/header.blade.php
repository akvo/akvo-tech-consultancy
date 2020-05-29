<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="author" content="Akvo">
    <title>SIG-POC</title>
    <link rel="icon" href="{{asset('images/solomon-island-ico.ico')}}">
    <link href="{{asset(mix('css/app.css'))}}" rel="stylesheet">
    <link href="{{asset('vendor/leaflet/leaflet.css')}}" rel="stylesheet">
    <!--
    <link href="{{asset('vendor/fontawesome/css/all.min.css')}}" rel="stylesheet">
    <script src="{{asset('js/vendors/d3.v3.min.js')}}" charset="utf-8"></script>
    <script src="{{asset('js/vendors/lodash.min.js')}}" charset="utf-8"></script>
    -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js" charset="utf-8"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js" charset="utf-8"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
</head>
