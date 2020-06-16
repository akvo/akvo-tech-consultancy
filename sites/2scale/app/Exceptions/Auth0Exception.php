<?php

namespace App\Exceptions;

use Exception;
use App\Http\Controllers\Auth\Auth0IndexController;

class Auth0Exception extends Exception
{
    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
        //
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        // return response(...);
        $auth = new Auth0IndexController();
        return $auth->logout(true, "email");
    }
}
