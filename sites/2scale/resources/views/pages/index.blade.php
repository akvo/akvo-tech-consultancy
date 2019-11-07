@extends ('template')

@section ('content')

<div class="bg-white shadow-sm">
	<nav class="nav">
        <select data-url="{{ $surveys['url'] }}" id="select-survey" class="selectpicker" data-live-search="true">
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
		<button class="btn btn-secondary">Load Survey</button>
	</nav>
</div>

<main role="main" class="container">
	<div class="my-3 p-3 bg-white rounded shadow-sm">
		<iframe id="akvo-flow-web" src="http://2scale.tc.akvo.org/akvo-flow-web/2scale/20020001" frameborder=0 width="100%" height="640px"></iframe>
	</div>
</main>

@endsection
