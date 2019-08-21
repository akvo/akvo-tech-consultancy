@extends('layouts.default')

@section('content')
<main role="main" class="col-md-12">
    <iframe src="{{asset('files/data_explorer_user_guide.pdf'))}}" width="100%"></iframe>
</main>

<div class="data-source">{!!Config::get('app.data-sources')!!}</div>
@endsection

@push('scripts')
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
@endpush
