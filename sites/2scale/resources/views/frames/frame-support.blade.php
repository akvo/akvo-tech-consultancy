<!DOCTYPE html>
<html>
<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="2SCALE website">
    <meta name="author" content="Akvo">
    <meta name="keywords" content="2SCALE">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>2SCALE</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
    <!-- Material Design Bootstrap -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.11/css/mdb.min.css" rel="stylesheet">
    <link href="{{ asset('vendor/font-awesome-4.7/css/font-awesome.min.css') }}" rel="stylesheet" media="all">
    <link href="{{ asset('vendor/font-awesome-5/css/fontawesome-all.min.css') }}" rel="stylesheet" media="all">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/4.6.0/echarts-en.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.1/axios.min.js" type="text/javascript"></script>
<style>
html,
body {
    height: 100%;
    background-color: #333;
    font-family: 'Montsterrat', sans-serif;
}

body {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-pack: center;
    -webkit-box-pack: center;
    justify-content: center;
    color: #000;
    background-color: #ffffff;
}

.cover-container {
  max-width: 42em;
}

h1 {
    font-weight: 100;
}

.masthead {
    margin-bottom: 2rem;
}

.masthead-brand {
    margin-bottom: 0;
}

.nav-masthead .nav-link {
    padding: .25rem 0;
    font-weight: 700;
    color: rgba(255, 255, 255, .5);
    background-color: transparent;
    border-bottom: .25rem solid transparent;
}

.nav-masthead .nav-link:hover,
.nav-masthead .nav-link:focus {
    border-bottom-color: rgba(255, 255, 255, .25);
}

.nav-masthead .nav-link + .nav-link {
    margin-left: 1rem;
}

.nav-masthead .active {
    color: #fff;
    border-bottom-color: #fff;
}

@media (min-width: 48em) {
    .masthead-brand {
        float: left;
    }
    .nav-masthead {
        float: right;
    }
}
.cover {
    padding: 0 1.5rem;
}
.cover .btn-lg {
    padding: .75rem 1.25rem;
    font-weight: 700;
}
</style>
</head>
<body class="text-center">
    <!--Section: Contact v.2-->
    <section class="container mb-2" style="margin-top: 35px">

        <!--Section heading-->
        <h2 class="h1-responsive font-weight-bold text-center my-4">Report Issue</h2>
        <!--Section description-->

        <div class="row d-flex justify-content-center">

            <!--Grid column-->
            <div class="col-md-10 mb-md-0 mb-5">
                <form action="{{url('api/send_email')}}" method="post">
                    @csrf
                    <!--Grid row-->
                    <div class="row">

                        <!--Grid column-->
                        <div class="col-md-6">
                            <div class="md-form">
                                <input type="text" id="name" name="name" class="form-control" placeholder="Your name" required>
                                {{-- <label for="name" class="">Your name</label> --}}
                            </div>
                        </div>
                        <!--Grid column-->

                        <!--Grid column-->
                        <div class="col-md-6">
                            <div class="md-form">
                                <input type="email" id="email" name="email" class="form-control" placeholder="Your email" required>
                                {{-- <label for="email" class="">Your email</label> --}}
                            </div>
                        </div>
                        <!--Grid column-->

                    </div>
                    <!--Grid row-->

                    <!--Grid row-->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="md-form">
                                <input type="text" id="subject" name="subject" class="form-control" placeholder="Subject" required>
                                {{-- <label for="subject" class="">Subject</label> --}}
                            </div>
                        </div>
                    </div>
                    <!--Grid row-->

                    <!--Grid row-->
                    <div class="row">

                        <!--Grid column-->
                        <div class="col-md-12">

                            <div class="md-form">
                                <textarea type="text" id="message" name="message" rows="2" class="form-control md-textarea" required style="margin-top: 10px"></textarea>
                                <label for="message" style="margin-bottom: 10px">Your message</label>
                            </div>

                        </div>
                    </div>

                    <!--Grid row Captcha-->
                    {{-- <div class="row">
                       <div class="col-md-6">
                            <div class="md-form">
                                <input type="text" id="captcha" name="captcha" class="form-control" placeholder="Captcha" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="md-form">
                                <img src="{{ captcha_src('flat') }}" class="rounded float-left" alt="captcha">
                            </div>
                        </div>
                    </div> --}}


                    <!--Grid row-->

                    <div class="text-center text-md-left">
                        <button type="submit" class="btn btn-primary">Send</button>
                    </div>
                </form>


                <div class="status" style="margin-top: 25px">
                    @if (isset($status) && $status === true)
                        <div class="alert alert-success" role="alert">
                            Your email has been sent to our support team, <br>
                            We'll get in touch with you, thank you.
                        </div>
                    @endif
                    @if (isset($status) && !$status)
                        <div class="alert alert-danger" role="alert">
                            Failed to send an email, there was some problem, <br>
                            Please try again.
                        </div>
                    @endif
                    @if (isset($status) && $status === 'invalid')
                        <div class="alert alert-danger" role="alert">
                            Wrong captcha!
                        </div>
                    @endif
                </div>
            </div>
            <!--Grid column-->

            <!-- <div class="col-md-1"></div> -->

            <!--Grid column-->
            <!-- <div class="col-md-3 text-center">
                <ul class="list-unstyled mb-0">
                    <li><i class="fas fa-map-marker-alt fa-2x"></i>
                        <p>San Francisco, CA 94126, USA</p>
                    </li>

                    <li><i class="fas fa-phone mt-4 fa-2x"></i>
                        <p>+ 01 234 567 89</p>
                    </li>

                    <li><i class="fas fa-envelope mt-4 fa-2x"></i>
                        <p>support@mail.com</p>
                    </li>
                </ul>
            </div> -->
            <!--Grid column-->

        </div>

    </section>
    <!--Section: Contact v.2-->
</body>
</html>
