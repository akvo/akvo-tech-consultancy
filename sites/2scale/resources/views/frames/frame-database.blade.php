<!DOCTYPE html>
<html>
<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="2SCALE website">
    <meta name="author" content="Akvo">
    <meta name="keywords" content="2SCALE">
    <meta name="data-url" content="{{$url}}">
    <meta name="start-date" content="{{$start}}">
    <meta name="end-date" content="{{$end}}">
    <title>2SCALE</title>
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
	<!-- Material Design Bootstrap -->
	<link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/css/mdb.min.css" rel="stylesheet">
	<!-- Datatables -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/b-html5-1.6.1/b-print-1.6.1/fh-3.1.6/kt-2.5.1/r-2.2.3/datatables.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.1/axios.min.js" type="text/javascript"></script>
</head>
<style>
html,
body{
    width:100%;
    font-family: 'Montsterrat', sans-serif;
}
table {
    font-size: 12px;
}
table td.bg-light-grey {
    background-color: #f9f9f9;
}
#datatables_filter,
#datatables_info{
    display: inline-block;
	padding-left:2rem;
}
#datatables_filter{
	float:right;
	margin-top:5px;
	padding-left:0px;
}
main.inner.cover {
    padding-left: 40px;
    padding-right: 40px;
}
#loader-spinner {
    margin-top: 40%;
}
.dt-button-collection .dropdown-menu {
    max-height: 400px;
    overflow-y: scroll;
    padding: 0px;
    margin-left: 5px;
    margin-top: 10px;
    border-radius: 0px;
}
.dt-button-collection .dropdown-menu a.dt-button {
    border-bottom: 1px solid #ddd;
}
</style>
<body>
    <div class="d-flex justify-content-center" id="loader-spinner">
      <div class="spinner-border text-primary loader-spinner" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
      <main role="main" class="inner cover">
        <div class="table-wrapper-scroll-y my-custom-scrollbar">
            <div id="grouptabsWrapper"></div>
            <div id="datatableWrapper" class="tab-content"></div>
		</div>
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
	<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
	<script type="text/javascript" src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.20/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/b-html5-1.6.1/b-print-1.6.1/fh-3.1.6/kt-2.5.1/r-2.2.3/datatables.min.js"></script>
    <script src="{{ mix('/js/database.js') }}"></script>
</body>
</html>
