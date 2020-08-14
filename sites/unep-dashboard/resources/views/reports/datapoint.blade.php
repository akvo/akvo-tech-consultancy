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

<div class="content">
    <div class="table-responsive-md">
        <table class="table table-sm table-custom borderless">
            <tbody>
                <tr>
                    <td><strong>Funding: </strong></td>
                    <td><strong>Contribution: </strong></td>
                </tr>
                <tr>
                    <td>
                        @if ($item['funds'] === 0)
                            -
                        @else                        
                            USD {{ money_format("%i", $item['funds']) }}
                        @endif
                    </td>
                    <td>
                        @if ($item['contribution'] === 0)
                            -
                        @else                        
                            USD {{ money_format("%i", $item['contribution']) }}
                        @endif
                    </td>
                </tr>
                <tr>
                    <td colspan="2">&nbsp;</td>
                </tr>
                @if (count($item['countries']) > 1)
                    <tr>
                        <td colspan="2"><strong>Countries</strong></td>
                    </tr>
                    <tr>
                        <td colspan="2">{{ join(', ', $item['countries']->toArray()) }}</td>
                    </tr>
                @else
                    <tr>
                        <td colspan="2"><strong>Country</strong></td>
                    </tr>
                    <tr>
                        <td colspan="2">{{ $item['countries'][0] }}</td>
                    </tr>
                @endif
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
                        <td class="indicator-name" width="25%">{{ $val['name'] }}</td>
                        <td class="pl-2">
                            @include('reports.indicator', ['val' => $val])
                        </td>
                    </tr>
                @endif
            @endforeach
            </tbody>
        </table>
    </div>
</div>
