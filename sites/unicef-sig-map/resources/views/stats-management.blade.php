@extends('layouts.default')
@section('content')
<main role="main" class="container">
<div class="card-deck mb-3 text-center">
    <div class="card mb-6">
        <div class="card-header">Toilets</div>
        <div id="toilet-in-schools" class="card-body" style="height:400px;"></div>
    </div>
    <div class="card mb-6">
        <div class="card-header">Schools</div>
        <div id="school-toilets" class="card-body" style="height:400px;"></div>
    </div>
</div>
</main>

@endsection

@push('scripts')
<script src="/js/charts.js"></script>
@endpush
