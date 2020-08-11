<div class="row">
    <div class="d-flex flex-column">
        <h3>Filters</h3>
        <div class="table-responsive">
            <table class="table table-sm table-hover table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">Filters</th>
                        <th class="text-center">Count</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['filters'] as $item)
                        <tr class="table-active">
                            <th colspan="2">{{ $item->name }}</th>
                        </tr>
                        @if ($item->childrens->count() > 0)
                            @foreach ($item->childrens as $item)
                                <tr>
                                    <td>{{ $item->name }}</td>
                                    <td class="text-center align-middle">1</td>
                                </tr>
                                @if ($item->childrens->count() > 0)
                                    @foreach ($item->childrens as $item)
                                        <tr>
                                            <td class="pl-4">{{ $item->name }}</td>
                                            <td class="text-center align-middle">1</td>
                                        </tr> 
                                    @endforeach
                                @endif
                            @endforeach
                        @endif
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    
    {{-- <div class="d-flex flex-column">
        @foreach($data['charts'] as $image)
            <img src="{{$image}}" alt="" width="100%">
        @endforeach
    </div> --}}
</div>