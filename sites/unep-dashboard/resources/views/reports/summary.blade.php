@php
    $ctext = "Project Country";
    $cval = $data['all_countries'][0];
    if (count($data['all_countries']) > 1) {
        $ctext = "Project Countries";
        $cval = "";
        foreach ($data['all_countries'] as $key => $value) {
            $cval .= $value;
            $cval .= ($key < count($data['all_countries']) - 1) ? ', ' : '';
        }
    }   
@endphp
<div class="content">
    <h4>{{ $ctext }}</h4>
    <p>{{ $cval }}</p>
</div>

@foreach ($data['charts'] as $key => $item)
    @include('reports.chart', ['item' => $item, 'block' => $data['blocks'][$key]])
@endforeach