<!DOCTYPE html>
<html>
<head>
  <!-- Required meta tags-->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="2SCALE website">
  <meta name="author" content="Akvo">
  <meta name="path" content="{{env('APP_URL')}}">
  <meta name="keywords" content="2SCALE">
  <title>2SCALE</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
  <!-- Material Design Bootstrap -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/css/mdb.min.css" rel="stylesheet">
  <link href="{{ asset('vendor/font-awesome-4.7/css/font-awesome.min.css') }}" rel="stylesheet" media="all">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.6.0/echarts-en.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.1/axios.min.js" type="text/javascript"></script>
  <link href="{{ asset('vendor/font-awesome-5/css/fontawesome-all.min.css') }}" rel="stylesheet" media="all">
  <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">

  {{-- Old --}}
  {{-- <style>
    .view,body,html{height:100%}@media (max-width:740px){.full-page-intro{height:1000px}}.carousel{height:50%}.carousel .carousel-inner,.carousel .carousel-inner .active,.carousel .carousel-inner .carousel-item{height:100%}@media (max-width:776px){.carousel{height:100%}}.navbar{background-color:rgba(0,0,0,.2)}.page-footer,.top-nav-collapse{background-color:#1C2331}@media only screen and (max-width:768px){.navbar{background-color:#1C2331}}
    .text-title-page h2 {
        font-weight: 300,
    }
    h2.card h2.main-icons .card-body h1, .card .card-body h2 {
        font-size: 60px!important;
    }
    h2.main-icons{
      color:#4285f4!important;
    }

    @media (max-width: 740px) {
      html,
      body,
      header,
      .view {
        height: 1050px;
      }
    }

    @media (min-width: 800px) and (max-width: 850px) {
      html,
      body,
      header,
      .view {
        height: 700px;
      }
    }

    @media (min-width: 800px) and (max-width: 850px) {
        .navbar:not(.top-nav-collapse) {
            background: #1C2331!important;
        }
    }

    .result_media {
        width: 100%,
        height: 500px
    }
    .card {
        z-index:2;
    }
    .rotated-data {
        left: 0;
        position: absolute;
        /* top: 55vh; */
        top: 20vh;
        width: 100%;
        background: #FFF;
        height: 100vh;
        z-index:1;
        transform: skewY(-5.5deg);
    }
    .text-title-page{
        position: absolute;
        /* top: 20vh; */
        top: 8vh;
        border: 'botton';
    }
    .text-title-page h2{
        font-weight:bold;
        font-size: 60px;
        color:white;
    }
    .text-title-page p{
        color:white;
    }
    .green-gradient {
        background: linear-gradient(40deg,#6effd7,#83ec41)!important;
    }
    .red-gradient {
        background: linear-gradient(40deg,#f8ffbc,#0b7b67)!important;
    }
    .view video.video-intro{
        max-height: 250vh;
        /* min-height: 150vh; */
    }

    #maps {
      height: 500px;
    }
  </style> --}}
  {{-- End Old --}}

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
</head>
<body class="text-center">
  {{-- Old --}}
  {{-- <header style="height: 100%">
      <!-- Full Page Intro -->
      <div class="view full-page-intro">

        <!--Video source-->
        <video class="video-intro" autoplay loop muted>
          <source src="/_background.mp4" type="video/mp4" />
        </video>

        <!-- Mask & flexbox options-->
        <div class="mask d-flex justify-content-center align-items-center">
          <!-- Content -->
          <div class="container">
            <!--Grid row-->
            <div class="row d-fleax h-100 justify-content-conter">
              <div class="text-title-page col-md-6 mb-4 text-left">
                <img src="/images/2scale_logo_white.png" height=40px>
                <h2>Data Portal</h2>
              </div>
            </div> --}}

            {{-- <div class="row d-flex h-100 justify-content-center align-items-center wow fadeIn" style="margin-top: 50vh">
              <!--Grid column-->
              @foreach($cards as $card)
              <div class="col-md-{{$card['width']}} mb-4">
                <div class="card py-2" id="intro">
                  <div class="card-body text-center" style="min-height:200px">
                    <h2 class="mb-4 font-weight-bold main-icons"><i class="fas fa-{{$card['icon']}}"></i></h2>
                      <hr>
                      <p>{{$card['text']}}</p>
                  </div>
                  <div class="card-footer">
                    <a target="_blank" href="{{$card['link']}}" class="btn btn-success {{$card['color']}} btn-block btn-rounded">{{$card['button']}}<i class="fas fa-{{$card['icon']}}-alt ml-2"></i>
                    </a>
                  </div>
                </div>
              </div>
              @endforeach
              <!--Grid column-->
            </div> --}}


            {{-- <!-- New home visual -->
            <div class="row d-flex h-100 p-3 justify-content-center align-items-center wow fadeIn" style="margin-top: 25vh" id="zero-row">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-header 2scale-brand">
                    2SCALE Partnership
                  </div>
                  <div class="card-body">
                    <div id="maps"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cover-container d-flex h-100 p-3 mx-auto flex-column" style="z-index: 999">
              <main role="main" class="inner cover">
              </main>
            </div>
            <!-- End of New home visual -->
            <!--Grid row-->
          </div>
          <!-- Content -->

          <div class="rotated-data"></div>
        </div>
        <!-- Mask & flexbox options-->
      </div>
      <!-- Full Page Intro -->
  </header> --}}
  {{-- End Old --}}

  <div class="text-center py-2 px-4 mt-3">
    <div class="row" id="zero-row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header 2scale-brand">
            Incubating Inclusive Agribusiness
          </div>
          <div class="card-body mask">
            <div id="maps"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
    <main role="main" class="inner cover"></main>
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
  <script src="{{ mix('/js/main-home.js') }}"></script>
</body>
</html>
