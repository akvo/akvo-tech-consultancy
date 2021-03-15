
@extends ('template')

@section ('content')

<div class="bg-white shadow-sm flex-display selector-bar">
	<nav class="nav nav-md-6 nav-selector">
        <select id="select-database-survey" class="selectpicker" data-style="btn-pink" data-live-search="true">
		  <option value="">Select Survey</option>
            @foreach ($surveys['forms'] as $form)
              <optgroup label="{{ $form['name'] }}">
                @foreach($form["list"] as $list)
                <option 
                    data-tokens="{{ $list['name'] }}"
                    data-id="{{ $list['form_id'] }}"
                    value="{{ $list['form_id'] }}">
                    {{ $list['name'] }}
                </option>
                @endforeach
              </optgroup>
            @endforeach
		</select>
	</nav>
	<nav class="nav nav-md-6 nav-selector">
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
	<nav class="nav nav-md-6 nav-selector">
        <span class="btn dropdown-toggle daterange"> Select Date :</span>
        <input type="text" class="btn dropdown-toggle datarange-picker" name="daterange" value="01/01/2019 - 01/15/2010" />
	</nav>
	<nav class="nav nav-md-4 align-right">
        <div class="btn-group">
          <button type="button" class="btn btn-secondary btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Explore</button>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#" id="btn-data-inspect"><i class="fas fa-play-circle"></i> Inspect</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" id="btn-data-download"><i class="fas fa-arrow-circle-down"></i> Download</a>
          </div>
        </div>
	</nav>
</div>

<main role="main" class="row">
    <iframe id="data-frame" src="/frame/blank" frameborder=0 width="100%"></iframe>
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
