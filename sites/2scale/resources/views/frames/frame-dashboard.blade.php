<!DOCTYPE html>
<html>
<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="2SCALE website">
    <meta name="author" content="Akvo">
    <meta name="path" content="{{env('APP_URL')}}">
    <meta name="country" content="{{$country_id}}">
    <meta name="partnership" content="{{$partnership_id}}">
    <meta name="start-date" content="{{$start}}">
    <meta name="end-date" content="{{$end}}">
    <meta name="keywords" content="2SCALE">
    <title>2SCALE</title>
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
	<!-- Material Design Bootstrap -->
	<link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/css/mdb.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.6.0/echarts-en.min.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/b-html5-1.6.1/b-print-1.6.1/fh-3.1.6/kt-2.5.1/r-2.2.3/datatables.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.1/axios.min.js" type="text/javascript"></script>
    <link rel="stylesheet" href="{{mix('css/print.css')}}">
</head>
<style>
html,
body{
    width:95%;
	margin:auto;
    font-family: 'Montsterrat', sans-serif;
}
.loader-spinner {
    position:absolute;
    top: 45%;
}
.view.view-cascade {
    border-radius: 3px;
    margin: 5px;
}
#maps {
	height: 500px;
}
</style>
<body>
    <!-- Jumbotron -->
  <div class="text-center py-2 px-4">
	<div id="jumbotron" class="row"></div>
  </div>
  <div class="text-center py-2 px-4">
	<div class="row" id="zero-row">
	<div class="col-md-6">
		<div class="card">
			<div class="card-header">
			    2SCALE Programs	
  			</div>
			<div class="card-body mask rgba-blue-slight">
			<div id="maps"></div>
  			</div>
  		</div>
  	</div>
  	</div>
  </div>
    <!-- Jumbotron -->
    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
      <main role="main" class="inner cover">
      </main>
    </div>
    <!-- Global Dependencies -->
	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<!-- Bootstrap tooltips -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js"></script>
	<!-- Bootstrap core JavaScript -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
	<!-- MDB core JavaScript -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/js/mdb.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/b-html5-1.6.1/b-print-1.6.1/fh-3.1.6/kt-2.5.1/r-2.2.3/datatables.min.js"></script>
	<!-- Bootstrap Select -->
    <script src="{{ mix('/js/home.js') }}"></script>
</body>
</html>
