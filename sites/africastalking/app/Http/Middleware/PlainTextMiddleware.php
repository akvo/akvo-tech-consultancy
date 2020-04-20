<?php

namespace App\Http\Middleware;

use Closure;

class PlainTextMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $input = $next($request);
        return $input->header('Content-Type', 'text/plain');
    }
}
