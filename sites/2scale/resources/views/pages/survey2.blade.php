@extends ('template')

@section ('content')

<div class="bg-white shadow-sm flex-display selector-bar">
@if(!isset($saved_survey))
	<nav class="nav nav-md-6 nav-selector">
        <select id="survey-parent" class="selectpicker" data-style="btn-pink" data-live-search="true">
		  <option value="select-init">Select Survey</option>
            @foreach($surveys['forms'] as $index => $form)
            <option
                value="parent-{{ $index }}">
                {{ $form['name'] }}
            </option>
            @endforeach
		</select>
	</nav>
	<nav class="nav nav-md-6 nav-selector">
        <select data-url="{{ $surveys['url'] }}" id="select-survey" class="selectpicker" data-style="btn-pink" data-live-search="true">
            <option class="select-init" value="">Select Questionnaire</option>
            @foreach($surveys['forms'] as $index => $form)
            <option
                class="form-parent">
                {{ $form['name'] }}
            </option>
                    @foreach($form["list"] as $list)
                    <option
                        class="form-list parent-{{ $index }}"
                        data-tokens="{{ $list['name'] }}"
                        data-id="{{ $list['form_id'] }}"
                        value="{{ $list['form_id'] }}">
                        {{ $list['name'] }}
                    </option>
                    @endforeach
            @endforeach
		</select>
	</nav>
@endif
</div>

<main role="main" class="row">
    <div class="col-md-12">
    @if(isset($saved_survey))
        <iframe id="akvo-flow-web" src="{{ $saved_survey }}" frameborder=0 width="100%" ></iframe>
    @else
        <iframe id="akvo-flow-web" src="/frame/blank" frameborder=0 width="100%"></iframe>
    @endif
    </div>
</main>

@endsection