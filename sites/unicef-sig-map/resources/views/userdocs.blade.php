@extends('layouts.default')

@section('content')
    <iframe id="documentation" src="{{asset('/files/data_explorer_user_guide.pdf')}}" frameborder="0" style="overflow:hidden;width:100%" width="100%"></iframe>
@endsection

@push('scripts')
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
<script>
    let windowHeight = 0;
    windowHeight = document.body.clientHeight - 70;
    $("iframe#documentation").css("height", windowHeight);
    $("body").css("background-color","rgb(82, 86, 89)");
    $(".form-inline").remove();
</script>
@endpush
