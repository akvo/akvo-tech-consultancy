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
	</nav>
</div>

<main role="main" class="row">
    <iframe id="akvo-flow-web" src="/frame-blank" frameborder=0 width="100%"></iframe>
</main>

@endsection
