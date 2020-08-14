<div class="header">
    <div class="float-left text-wrap" style="width:80%">
        @if (strlen($title) > 75)
        <h4>{{ $title }}</h4>
        @elseif (strlen($title) > 25)
        <h4 class="pt-3">{{ $title }}</h4>
        @else
        <h3 class="pt-3">{{ $title }}</h3>
        @endif
    </div>
    <img class="float-right ml-4" src="{{ asset('/images/logo-report.png') }}" width="75vh">
    <div class="clearfix"></div>
</div>
<div class="clearfix"></div>
<div class="header-line my-3"></div>