<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Auth0IndexController extends Controller
{
    /**
     * Redirect to the Auth0 hosted login page
     *
     * @return mixed
     */
    public function login()
    {
        $authorize_params = [
            'scope' => 'openid profile email',
            // Use the key below to get an access token for your API.
            // 'audience' => config('laravel-auth0.api_identifier'),
        ];
        $results = \App::make('auth0')->login(null, null, $authorize_params);
        return $results;
    }

    /**
     * Log out of Auth0
     *
     * @return mixed
     */
    public function logout($error = false)
    {
        \Auth::logout();
        $logoutUrl = sprintf(
            'https://%s/v2/logout?client_id=%s&returnTo=%s',
            config('laravel-auth0.domain'),
            config('laravel-auth0.client_id'),
            url('/')
        );

        if ($error) {
            return \Redirect::intended($logoutUrl)->withErrors("error");
        }
        return \Redirect::intended($logoutUrl);
    }
}
