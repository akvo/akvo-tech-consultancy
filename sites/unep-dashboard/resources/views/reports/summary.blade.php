<div class="content">
    <h4>Project Countries</h4>
    <p class="text-justify">
        @php
            $x = 1;
        @endphp
        @foreach ($data['all_countries'] as $item)
            {{ $item }}
            @if ($x < $data['all_countries']->count())
                ,
            @endif
            @php
                $x++;
            @endphp
        @endforeach
    </p>
</div>

@php
    $y = 1;
    $index = 0;
@endphp
@foreach ($data['charts'] as $item)
    <div class="content">
        <h4>{{ $data['blocks'][$index] }}</h4>
        <div>
            <img class="center" src="{{ $item }}" alt="Card image cap">
        </div>
    </div>
    {{-- @if ($y < count($data['charts']))
        <div class="page-break"></div>
    @endif --}}
    @php
        $y++;
        $index++;
    @endphp
@endforeach