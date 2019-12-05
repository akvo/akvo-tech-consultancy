<!DOCTYPE html>
<html>
<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="2scale website">
    <meta name="author" content="Akvo">
    <meta name="country" content="{{$country_id}}">
    <meta name="partnership" content="{{$partnership_id}}">
    <meta name="keywords" content="2scale">
    <title>2Scale</title>
	<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
	<!-- Material Design Bootstrap -->
	<link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/css/mdb.min.css" rel="stylesheet">
</head>
<style>
html,
body{
    width:95%;
	margin:auto;
}
.loader-spinner {
    position:absolute;
    top: 45%;
}
.view.view-cascade.gradient-card-header{
    border-radius: 3px;
    margin: 5px;
}
#maps {
	height: 500px;
}
</style>
<body>
    <!-- Jumbotron -->
  <div class="text-white text-center py-2 px-4">
	<div id="jumbotron" class="row"></div>
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
	<!-- Bootstrap Select -->
    <script src="{{ asset('/js/partnership.js') }}"></script>
</body>
</html>
