<div class="content">
    @if (count($data['all_countries']) > 1)
        <h4>Project Countries</h4>
        <p>{{ join(', ', $data['all_countries']->toArray()) }}</p>
    @else
        <h4>Project Country</h4>
        <p>{{ $data['all_countries'] }}</p>
    @endif
</div>

<div class="content">
    <h4>Summary</h4>
</div>
<table width="100%">
<tr>
<td>
@foreach ($data['charts'] as $key => $item)
    @include('reports.chart', ['item' => $item, 'block' => $data['blocks'][$key], 'counter' => $key])
@endforeach
</td>
</tr>
</table>
