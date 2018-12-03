@extends('layouts.default')
@section('content')
<div class="col-md-12">
    <div class="row" id="vizcomps"></div>
</div>

@endsection

@push('scripts')
<script src="{{asset(mix('js/visualization.js'))}}"></script>
@endpush
