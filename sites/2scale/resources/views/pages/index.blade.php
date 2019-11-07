@extends('template')

@section('content')

<div class="bg-white shadow-sm">
	<nav class="nav">
		<select class="selectpicker">
		  <option>Reach and React</option>
		  <optgroup label="Picnic">
			<option>Ketchup</option>
			<option>Relish</option>
		  </optgroup>
		  <optgroup label="Camping">
			<option>Tent</option>
			<option>Flashlight</option>
			<option>Toilet Paper</option>
		  </optgroup>
		</select>
		<button class="btn btn-secondary">Load Survey</button>
	</nav>
</div>

<main role="main" class="container">
	<div class="my-3 p-3 bg-white rounded shadow-sm">
		<iframe src="http://2scale.tc.akvo.org/akvo-flow-web/2scale/20020001" frameborder=0 width="100%" height="640px"></iframe>
	</div>
</main>

@endsection
