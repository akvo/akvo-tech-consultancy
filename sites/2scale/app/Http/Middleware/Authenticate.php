<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use App\Repositories\CustomUserRepository;
use App\Http\Controllers\Auth\Auth0IndexController;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }

    public function handle($request, Closure $next, ...$guards)
    {
        // if ($request->requestUri === '/login') {
        //     \Auth::logout();
        //     return redirect()->back();
        // }

        $this->authenticate($request, $guards);
        $fetch = new CustomUserRepository();
        if (\Auth::check() && !$fetch->fetchFlowUser()) {
            return $next($request);
        }

        $auth = new Auth0IndexController();
        return $auth->logout(true);
        //return redirect()->back()->withErrors("error");
    }
}
