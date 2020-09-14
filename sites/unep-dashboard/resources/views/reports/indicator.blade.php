@if (count($val['childrens']) > 0)
    @if(count($val['childrens']) === 1)
        <div>
        {{$val['childrens'][0]['name']}}
        @include('reports.indicator', ['val' => $val['childrens'][0]])
        </div>
    @else
    <ul>
    @foreach ($val['childrens'] as $x)
        <li>{{ $x['name'] }}</li>
    @endforeach
        @include('reports.indicator', ['val' => $x])
    </ul>
    @endif
@endif
