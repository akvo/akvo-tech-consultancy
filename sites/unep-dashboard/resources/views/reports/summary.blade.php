<div class="content">
    <div class="my-3" style="min-width: 100%">
        <div class="float-left" style="width: 50%">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Type of Action</h5>
                    <img class="card-img-bottom" src="{{ $data['charts'][0] }}" alt="Card image cap">
                </div>
            </div>
        </div>
        <div class="float-right" style="width: 50%">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Action Target</h5>
                    <img class="card-img-bottom" src="{{ $data['charts'][3] }}" alt="Card image cap">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="content">
    <div class="my-3" style="min-width: 100%">
        <h5 class="card-title">Filters</h5>
        <div class="table-responsive-lg">
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">Filters</th>
                        <th class="text-center">Count</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['filters'] as $item)
                        @if ($item->childrens->count() > 0)
                            <tr class="table-active">
                                <th colspan="2">{{ $item->name }}</th>
                            </tr>
                        @endif
                        @if ($item->childrens->count() > 0)
                            @foreach ($item->childrens as $item)
                                <tr>
                                    <td>{{ $item->name }}</td>
                                    <td class="text-center align-middle">1</td>
                                </tr>
                                {{-- @if ($item->childrens->count() > 0)
                                    @foreach ($item->childrens as $item)
                                        <tr>
                                            <td class="pl-4">{{ $item->name }}</td>
                                            <td class="text-center align-middle">1</td>
                                        </tr> 
                                    @endforeach
                                @endif --}}
                            @endforeach
                        @endif
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    
    {{-- @foreach($data['charts'] as $image)
        <div class="card my-3" style="min-width: 100%">
            <div class="card-body">
                <img src="{{$image}}" alt="" width="100%">
            </div>
        </div>
    @endforeach --}}
</div>