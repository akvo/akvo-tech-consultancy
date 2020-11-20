<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Beyond Chocolate') }}</title>
        <link href="{{mix('/css/app.css')}}" rel="stylesheet">
    </head>
    <body>
        <div id="app"></div>
    </body>
    <script src="{{mix('/js/app.js')}}" type="text/javascript"></script>
    @if (env('APP_ENV') === 'production')
    <script type="text/javascript" src="https://tc.akvo.org/analytics/analytics-left.js"></script>
    <noscript>
        <iframe src="//analytics.akvo.org/containers/f6fdd448-a2bc-4734-8aa0-dba4d0d0f2a3/noscript.html" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
    @endif
</html>
