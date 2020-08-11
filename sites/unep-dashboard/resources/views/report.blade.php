<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Report</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

    <style>
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
    <div class="container py-5">
        {{-- Summary --}}
        @if ($data["datapoints"]->count() > 1)
            @include('reports.header', ['title' => "Summary"])
            @include('reports.summary', [$data])
            @include('reports.footer')
            <div class="page-break"></div>
        @endif
        {{-- EOL Summary --}}

        {{-- Datapoint --}}
        @foreach ($data['datapoints'] as $item)     
            @include('reports.header', ['title' => $item->uuid])
            @include('reports.datapoint', [$item])
            @include('reports.footer')
            <div class="page-break"></div>
        @endforeach
        {{-- EOL Datapoint --}}
    </div>

    {{-- <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script> --}}
</body>
</html>