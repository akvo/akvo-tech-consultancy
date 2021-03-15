
@extends ('template')

@section ('content')

<div class="bg-white shadow-sm flex-display selector-bar">
	<nav class="nav nav-selector">
        <select id="partnership-country" class="selectpicker" data-style="" data-live-search="true">
		  <option value="0">Select Country</option>
            @foreach($countries as $country)
            <option
                data-tokens="{{ $country['name'] }}"
                data-id="{{ $country['id'] }}"
                value="{{ Str::title($country['id']) }}">
                {{ Str::title($country['name']) }}
            </option>
            @endforeach
		  <option value="0">All Countries</option>
		</select>
	</nav>
	<nav class="nav nav-md-6 nav-selector">
        <select id="partnership-code" class="selectpicker" data-style="" data-live-search="true">
		  <option value="">Select Partnership</option>
		</select>
	</nav>
	<nav class="nav nav-md-6 nav-selector">
        <span class="btn dropdown-toggle daterange"> Select Date :</span>
        <input type="text" class="btn dropdown-toggle datarange-picker" name="daterange" value="01/01/2019 - 01/15/2010" />
	</nav>
	<div class="nav nav-md-4 align-right" style="margin-left:10px;">
      <button type="button" id="generate-partnership-page" class="btn btn-primary"> Generate Charts</button>
      <button type="button" id="generate-report-link" class="btn btn-primary"> Generate Profile</button>
	</div>
</div>

<main role="main" class="row">
    <iframe id="data-frame" src="/frame/partnership/0/0" frameborder=0 width="100%"></iframe>
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
