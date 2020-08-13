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
                        <tr class="table-active">
                            <th>{{ $val['name'] }}</th>
                        </tr>
                        @if (count($val['childrens']) > 0)
                            @foreach ($val['childrens'] as $x)
                                <tr>
                                    <td class="td-inner-one"> - {{ $x['name'] }}</td>
                                </tr>
                                @if (count($x['childrens']) > 0)
                                    @foreach ($x['childrens'] as $y)
                                        <tr>
                                            <td class="td-inner-two"> - {{ $y['name'] }}</td>
                                        </tr>
                                        @if (count($y['childrens']) > 0)
                                            @foreach ($y['childrens'] as $z)
                                                <tr>
                                                    <td class="td-inner-three"> - {{ $z['name'] }}</td>
                                                </tr>
                                            @endforeach
                                        @endif
                                    @endforeach
                                @endif
                            @endforeach
                        @endif
                    @endif
                @endforeach
            </tbody>
        </table>
    </div>
</div>