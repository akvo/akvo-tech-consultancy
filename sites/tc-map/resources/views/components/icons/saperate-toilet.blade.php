@if ($data === null)
    <i class="fa fa-venus-mars" aria-hidden="true"></i>
@else
    <i class="fa fa-venus" aria-hidden="true"></i>{{$data->boys}} | 
    <i class="fa fa-mars" aria-hidden="true"></i>{{$data->girls}} 
@endif
