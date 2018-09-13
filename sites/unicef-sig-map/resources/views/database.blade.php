@extends('layouts.default')

@section('content')
<main role="main" class="container">
    <table class="table table-bordered" id="school_table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Reg</th>
                <th>School</th>
                <th>Class</th>
                <th>Students</th>
                <th>Toilets</th>
                <th>Saperated</th>
            </tr>
        </thead>
    </table>
</main>
@endsection

@push('scripts')
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/af-2.3.0/b-1.5.2/b-colvis-1.5.2/b-flash-1.5.2/b-html5-1.5.2/b-print-1.5.2/cr-1.5.0/fc-3.2.5/fh-3.1.4/kt-2.4.0/r-2.2.2/rg-1.0.3/rr-1.2.4/sc-1.5.0/sl-1.2.6/datatables.min.js"></script>
<script src="{{asset(mix('js/database.js'))}}"></script>
@endpush
