<div class="content">
    <div class="table-responsive-md">
        <table class="table table-sm table-custom borderless">
            <tbody>
                <tr>
                    <td>
                        <img class="datapoint-img" width="100%" src="https://via.placeholder.com/300">
                    </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr>
                    <td class="text-justify">
                        {{ $item['keywords'] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

@php
    $funding = "-";
    $contrib = "-";    
    $ctext = "Country";
    $cval = $item['countries'][0];
    if ($item['funds'] !== 0) {
        $funding = 'USD '.money_format("%i", $item['funds']);
    }
    if ($item['contribution'] !== 0) {
        $contrib = 'USD '.money_format("%i", $item['contribution']); 
    }
    if (count($item['countries']) > 1) {
        $ctext = "Countries";
        $cval = "";
        foreach ($item['countries'] as $key => $value) {
            $cval .= $value;
            $cval .= ($key < count($item['countries']) - 1) ? ', ' : '';
        }
    }
@endphp
<div class="content">
    <div class="table-responsive-md">
        <table class="table table-sm table-custom borderless">
            <tbody>
                <tr>
                    <td><strong>Funding: </strong></td>
                    <td><strong>Contribution: </strong></td>
                </tr>
                <tr>
                    <td>{{ $funding }}</td>
                    <td>{{ $contrib }}</td>
                </tr>
                <tr>
                    <td colspan="2">&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>{{ $ctext }}</strong></td>
                </tr>
                <tr>
                    <td colspan="2">{{ $cval }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div class="content">
    <div class="table-responsive-md">
        <table class="table table-sm table-bordered table-custom">
            <tbody>
            @foreach ($item['indicators'] as $val)
                @if ($val['value'])    
                    <tr class="break-row">
                        <td class="indicator-name" width="20%">{{ $val['name'] }}</td>
                        <td>
                            @include('reports.indicator', ['val' => $val])
                        </td>
                    </tr>
                @endif
            @endforeach
            </tbody>
        </table>
    </div>
</div>
