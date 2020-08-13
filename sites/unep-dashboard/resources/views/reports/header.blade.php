<div class="header">
    <img class="float-left mr-3" src="https://unep.tc.akvo.org/images/logo-unep.png" height="50vh">
    @if (strlen($title) > 75)
        <h6>{{ $title }}</h6>
    @elseif (strlen($title) > 25)
        <h5 class="pt-2">{{ $title }}</h5>
    @else
        <h4 class="pt-2">{{ $title }}</h4>
    @endif
</div>
<div class="header-line my-3"></div>