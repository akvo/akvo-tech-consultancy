@extends('general')

@section('content')
    <h1>Data Sources</h1>
    <hr/>
    <table class="table table-bordered">
        <thead>
            <tr>
                <td>Form ID</td>
                <td>Form Name</td>
                <td>Country</td>
                <td>File</td>
                <td>URL</td>
            </tr>
        </thead>
        <tbody>
        @foreach($data as $d)
            <tr>
                <td>{{$d['form_id']}}</td>
                <td>{{$d['form_name']}}</td>
                <td>{{$d['country']}}</td>
                <td>{{$d['file']}}</td>
                <td><a class="btn btn-sm btn-primary" href="{{$d['url']}}">View</a></td>
            </tr>
        @endforeach
        <tbody>
    </table>
@endsection
