
@extends ('template')

@section ('content')

<div class="bg-white shadow-sm flex-display selector-bar">
	<nav class="nav nav-md-12 nav-selector">
        <select id="select-country-survey" class="selectpicker" data-style="btn-pink" data-live-search="true">
		  <option value="">Select Country</option>
            @foreach($surveys["countries"] as $country)
            <option 
                data-tokens="{{ $country['name'] }}"
                data-id="{{ $country['id'] }}"
                value="{{ Str::title($country['name']) }}">
                {{ Str::title($country['name']) }}
            </option>
            @endforeach
		</select>
	</nav>
</div>

<main role="main" class="row">
    <iframe id="data-frame" src="/frame-charts-hierarchy" frameborder=0 width="100%"></iframe>
</main>

<!--Modal: modalCookie-->
<div class="modal fade top" id="notable" tabindex="-1" role="dialog" aria-labelledby="notable" aria-hidden="true" data-backdrop="true">
  <div class="modal-dialog modal-frame modal-top modal-notify modal-info" role="document">
    <!--Content-->
    <div class="modal-content">
      <!--Body-->
      <div class="modal-body">
        <div class="row d-flex justify-content-center align-items-center">

          <p class="pt-3 pr-2">No Survey Selected, Please Select Survey!</p>
        </div>
      </div>
    </div>
    <!--/.Content-->
  </div>
</div>
<!--Modal: modalCookie-->
@endsection
