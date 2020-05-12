<?php

namespace App\Http\Utilities;

use Illuminate\Http\Request;

class HttpResponse
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function error($status)
    {
        switch ($status) {
            case 500:
                return response(['message' => 'General Server Error'], 500);
                
            case 403:
                return response(['message' => 'Unauthorised'], 403);

            default:
                return response(['message' => 'Not Found'], 404);
        }

        return $status;
    }

    public function success($message)
    {
        return response($message, 200);
    }

    public function created($message)
    {
        return response($message, 201);
    }

    public function accepted($message)
    {
        return response($message, 202);
    }

    public function noContent($message)
    {
        return response($message, 204);
    }
}

