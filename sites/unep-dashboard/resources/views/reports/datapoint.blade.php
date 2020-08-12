<div class="content">
    <div class="my-3" style="min-width:100%">
        <img class="float-left rounded" src="http://lorempixel.com/output/nature-q-g-640-480-5.jpg" style="width: 45%">
        <div class="pl-3 float-right" style="width: 50%;">
            <h5>Section Title</h5>
            <p class="text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
        </div>
    </div>
</div>

<div class="content">
    <div class="my-3" style="min-width: 100%">
        <div class="table-responsive-md">
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <td>Funding</td>
                        <th>$USD {{ $item->funds }}</th>
                    </tr>
                    <tr>
                        <td>Contribution</td>
                        <th>$USD {{ $item->contribution }}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="content">
    {{-- <div class="d-flex flex-column my-3">
        @if ($item['countries']->count() > 0)
            <div class="card my-3">
                <div class="card-header">
                    <h5 class="mb-0">
                        @if ($item['countries']->count() > 1)
                            Countries
                        @else
                            Country
                        @endif
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        @foreach ($item['countries'] as $val)
                            {{ $val['country']->name }},
                        @endforeach      
                    </p>
                </div>
            </div>
        @endif
        <div class="card my-3">
            <div class="card-header">
                <h5 class="mb-0">Further Information</h5>
            </div>
            <div class="card-body">
                <p class="card-text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                </p>
            </div>
        </div>
        <div class="card my-3">
            <div class="card-header">
                <h5 class="mb-0">Another Link</h5>
            </div>
            <div class="card-body">
                <p class="card-text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                </p>
            </div>
        </div>
    </div> --}}
</div>