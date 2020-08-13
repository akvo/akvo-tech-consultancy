<div class="header">
    <img class="float-left mr-3" src="{{ asset('/images/logo-unep.png') }}" height="50vh">
    @if (strlen($title) > 75)
        <h4>{{ $title }}</h4>
    @elseif (strlen($title) > 25)
        <h4 class="pt-2">{{ $title }}</h4>
    @else
        <h3 class="pt-2">{{ $title }}</h3>
    @endif
</div>
<div class="header-line my-3"></div>