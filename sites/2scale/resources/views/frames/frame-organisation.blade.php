<!DOCTYPE html>
<html>
<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="2SCALE website">
    <meta name="author" content="Akvo">
    <meta name="keywords" content="2SCALE">
    <title>2SCALE</title>
	<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
    <!-- Vendor CSS-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/css/bootstrap-select.min.css">
	<!-- Material Design Bootstrap -->
	<link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/css/mdb.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.6.0/echarts-en.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.1/axios.min.js" type="text/javascript"></script>
</head>
<style>
html,
body{
    width:100%;
	margin:auto;
    font-family: 'Montsterrat', sans-serif;
}
.view.view-cascade {
    border-radius: 3px;
    margin: 5px;
}
#hierarchy{
	height: 70vh;
}
.full-width {
    width: 100%;
}
.cover-container {
    width:95%;
	margin:auto;
}
input.btn.dropdown-toggle.btn-light{
    width: 200px;
    text-align: left;
    border: none;
}

.dropdown-item.active, .dropdown-item:active{
	background-color:#2dbbad;
}
.bootstrap-select:not([class*=col-]):not([class*=form-control]):not(.input-group-btn):focus {
	outline: none;
}
button.btn.dropdown-toggle.btn-pink.bs-placeholder {
    color: #FFF;
}
.jumbotron.card {
    background-image: url(https://mdbootstrap.com/img/Photos/Others/gradient1.jpg);
    background-size:cover;
}
#loader-spinner {
    margin-top: 20%;
}
</style>
<body>
    <!-- Jumbotron-->

<div class="bg-white flex-display selector-bar" style="padding-top:30px;">
	<nav class="text-center">
    <select id="select-country-survey" class="selectpicker" data-style="" data-live-search="true">
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
    <div class="d-flex justify-content-center mt-2">
        <small class="text-muted">Actors collaborating within the partnerships</small>
    </div>
</div>
    <!-- End Jumbotron-->

    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
      <main role="main" class="inner cover" id="organisation">
        <div class="d-flex justify-content-center" id="hierarchy">
          <div class="spinner-border text-primary loader-spinner" id="loader-spinner" role="status">
          </div>
        <div>
      </main>
    </div>
    <!-- Global Dependencies -->
	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<!-- Bootstrap tooltips -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js"></script>
	<!-- Bootstrap core JavaScript -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
	<!-- Bootstrap Select -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>
	<!-- MDB core JavaScript -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/js/mdb.min.js"></script>
	<!-- Bootstrap Select -->
    <script src="{{ mix('/js/organisation.js') }}"></script>
</body>
</html>
