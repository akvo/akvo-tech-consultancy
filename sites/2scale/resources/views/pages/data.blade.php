
@extends ('template')

@section ('content')

<div class="bg-white shadow-sm flex-display">
	<nav class="nav nav-md-6">
        <select id="select-database-survey" class="selectpicker" data-live-search="true">
		  <option>Select Survey</option>
            @foreach ($surveys['forms'] as $form)
              <optgroup label="{{ $form['name'] }}">
                @foreach($form["list"] as $list)
                <option 
                    data-tokens="{{ $list['name'] }}"
                    data-id="{{ $list['id'] }}"
                    value="{{ $list['id'] }}">
                    {{ $list['name'] }}
                </option>
                @endforeach
              </optgroup>
            @endforeach
		</select>
	</nav>
	<nav class="nav nav-md-6">
        <select id="select-country-survey" class="selectpicker" data-live-search="true">
		  <option>Select Country</option>
            @foreach($surveys["countries"] as $country)
            <option 
                data-tokens="{{ $country['name'] }}"
                data-id="{{ $country['id'] }}"
                value="{{ $country['id'] }}">
                {{ Str::title($country['name']) }}
            </option>
            @endforeach
		</select>
	</nav>
	<nav class="nav nav-md-6">
        <span class="btn dropdown-toggle btn-light daterange"> Select Date :</span>
        <input type="text" class="btn dropdown-toggle btn-light" name="daterange" value="01/01/2019 - 01/15/2010" />
	</nav>
	<nav class="nav nav-md-6 align-right">
        <div class="btn-group">
          <button type="button" class="btn btn-secondary btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Explore</button>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#"><i class="fas fa-play-circle"></i> Inspect</a>
            <a class="dropdown-item" href="#"><i class="fas fa-arrow-circle-down"></i> Download</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#"><i class="fas fa-question-circle"></i> FAQ</a>
          </div>
        </div>
	</nav>
</div>

<main role="main" class="row">
    <iframe id="akvo-flow-web" src="/blank-survey" frameborder=0 width="100%"></iframe>
</main>

@endsection
