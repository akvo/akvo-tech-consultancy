<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Report</title>
    <!-- CSS only -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    
    <style>
        .header {
            display: block;
        }
        .content {
            margin-top:25px;
        }
        .header-line {
            width: 100%;
            height: 2px;
            background-color: #389FE3;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    {{-- <div class="container-fluid py-5"> --}}
        {{-- Summary --}}
        @if ($data["datapoints"]->count() > 1)
            @include('reports.header', ['title' => "Summary"])
            @include('reports.summary', [$data])
            {{-- @include('reports.footer') --}}
            <div class="page-break"></div>
        @endif
        {{-- EOL Summary --}}

        {{-- Datapoint --}}
        @php
            $x = 0    
        @endphp
        @foreach ($data['datapoints'] as $item)     
            @include('reports.header', ['title' => 'Project '.$item->uuid])
            @include('reports.datapoint', [$item])
            {{-- @include('reports.footer') --}}
            @if ($data['datapoints']->count())
                
            @endif
            <div class="page-break"></div>
        @endforeach
        {{-- EOL Datapoint --}}
    {{-- </div> --}}
</body>
</html>