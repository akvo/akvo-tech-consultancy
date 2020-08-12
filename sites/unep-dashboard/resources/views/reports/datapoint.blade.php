<div class="content">
    <img class="float-left rounded" src="http://lorempixel.com/output/nature-q-g-640-480-5.jpg" style="width: 45%">
    <div class="pl-3 float-right" style="width: 50%;">
        <h5>Description</h5>
        <p class="text-justify">{{ $item['keywords'] }}</p>
    </div>
</div>
<div class="clearfix"></div>

@foreach ($item['indicators'] as $val)
    <div class="content">
        <div class="content-title">
            <h5>{{ $val['parent'] }}</h5>
            <hr>
        </div>
        <div class="content-body">
            {{ $val['childs']['name'] }}
        </div>
    </div>
    <br>
@endforeach