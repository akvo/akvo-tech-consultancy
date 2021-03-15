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
      <button type="button" id="generate-reachreact-page" class="btn btn-primary"> Generate Charts</button>
	</div>
</div>

@section ('content')
<main role="main" class="row">
    <iframe id="data-frame" src="/frame/reachreact/0/0" frameborder=0 width="100%"></iframe>
</main>
@endsection
