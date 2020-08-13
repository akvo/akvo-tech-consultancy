<div class="content">
    <img class="float-left mr-4 mb-4" src="" style="width: 50%">
    <p class="text-justify">{{ $item['keywords'] }}</p>
    <div class="clearfix"></div>
</div>
<div class="clearfix"></div>

<div class="content">
    <div class="table-responsive-md">
        <table class="table table-sm table-bordered table-custom">
            <tbody>
            @foreach ($item['indicators'] as $val)
                @if ($val['value'])    
                    <tr class="break-row">
                        <td class="indicator-name">{{ $val['name'] }}</td>
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
