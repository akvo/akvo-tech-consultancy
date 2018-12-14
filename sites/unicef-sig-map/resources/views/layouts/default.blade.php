@include('components.header')
<body>
    @include('components.nav')
    @yield('content')
    @include('components.modal')
    @include('components.footer')
    @include('components.scripts')
</body>
