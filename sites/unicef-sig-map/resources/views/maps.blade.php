@push('search')
<div class="form-inline my-2 my-lg-0">
		<form onsubmit="focusTo()">
            <a href="#" onclick="focusNormal()" class="btn btn-light my-2 my-sm-0"><i class="fa fa-expand"></i></a>
            <a href="#" onclick="maps.zoomIn()" class="btn btn-light my-2 my-sm-0"><i class="fa fa-search-minus"></i></a>
            <a href="#" onclick="maps.zoomOut()" class="btn btn-light my-2 my-sm-0"><i class="fa fa-search-plus"></i></a>
            <input id="find" onkeydown="jqUI()" type="text" placeholder="Search School" class="form-control mr-sm-2">
            <input id="zoom_find" type="hidden">
			<input type="submit" id="find_submit" style="position: absolute; left: -9999px"/>
            <a href="#" onclick="focusTo()" class="btn btn-primary my-2 my-sm-0"><i class="fa fa-search"></i></a>
		</form>
</div>
@endpush

@extends('layouts.default')
@section('content')
<div id="mapid"></div>

@endsection

@push('scripts')
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"
  integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E="
  crossorigin="anonymous"></script>
<script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script scr="https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js"></script>
<script src="{{asset(mix('js/maps.js'))}}"></script>
@endpush
