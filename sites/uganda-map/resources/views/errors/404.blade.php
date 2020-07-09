@include('components.header')
<body>
    @include('components.nav')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4" style="margin-top: 10%;">
                <div class="login-logo"></div> 
                <h4 class="text-center"><small>Government of</small><br><strong>SOLOMON ISLANDS</strong></h4>
                <div class="card">
                    <div class="card-header text-center">Error Message</div>
                    <div class="card-body text-center">Sorry, Page Not Found<hr>
                    <a class="btn btn-primary btn-block" href="/">Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('components.footer')
    @include('components.scripts')
</body>
