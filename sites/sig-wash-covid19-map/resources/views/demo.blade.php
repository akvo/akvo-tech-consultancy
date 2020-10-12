@extends('layouts.default')
@section('content')
<div class="col-md-12">
    <div class="row" id="vizcomps"></div>
    <iframe width="100%" height="669" src="/timeline" frameBorder="0"></iframe>
</div>

@endsection

@push('scripts')
<script src="{{asset(mix('js/demo.js'))}}"></script>
@endpush
