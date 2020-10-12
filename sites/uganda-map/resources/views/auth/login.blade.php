@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-4" style="margin-top: 10%;">
            <div class="login-logo"></div> 
            <h4 class="text-center"><small>Government of</small><br><strong>KABAROLE</strong></h4>
            <div class="card">
                <div class="card-header" style="font-size:14;font-weight:bold;text-align:center;background-color:#343a40;color:#fff;">Input Code</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('login') }}" aria-label="{{ __('Login') }}">
                        @csrf
                        <input id="email" type="hidden" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="admin@admin.org" required autofocus>
                        <div class="form-group row">
                            <div class="col-md-12">
                                <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>
                                @if ($errors->has('password'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-primary btn-block" id="login-button">
                                    {{ __('Enter Code') }}
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group row mb-0">
                            <div class="col-md-12" style="margin-top:20px;text-align:center;">
                                I don't have verification code. <a href="http://www.mehrd.gov.sb/our-contacts" target="_blank">Contact Us </a>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
