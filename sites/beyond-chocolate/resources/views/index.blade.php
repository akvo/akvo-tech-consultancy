<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="cache-version" value="1.0.0">
        {{-- iframe cache control --}}
        {{-- <meta HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
        <meta HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE"> --}}

        <title>{{ config('app.name', 'Beyond Chocolate') }}</title>
        <link href="{{mix('/css/app.css')}}" rel="stylesheet">


        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        {{-- <link rel="icon" type="image/svg+xml" href="{{asset('/images/cocoa.svg')}}"> --}}
        {{-- <link rel=”mask-icon” href="{{asset('/images/cocoa.svg')}}" color="#000000"> --}}
        {{-- <link rel="icon" type="image/png" href="{{asset('/images/favico.png')}}"> --}}




    </head>
    <body>
        <div id="app"></div>
    </body>
    <script src="{{mix('/js/app.js')}}" type="text/javascript"></script>
    {{-- analytic --}}
    @if (env('APP_ENV') === 'production')
    <script type="text/javascript" src="https://tc.akvo.org/analytics/analytics-left.js"></script>
    <noscript>
        <iframe src="//analytics.akvo.org/containers/f6fdd448-a2bc-4734-8aa0-dba4d0d0f2a3/noscript.html" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    @endif
</html>
