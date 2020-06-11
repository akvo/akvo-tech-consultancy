<?php

// app/Repositories/CustomUserRepository.php
namespace App\Repositories;

use App\User;

use Auth0\Login\Auth0User;
use Auth0\Login\Auth0JWTUser;
use Auth0\Login\Repository\Auth0UserRepository;
use Illuminate\Contracts\Auth\Authenticatable;
use Auth0\Login\Auth0Service;
use App\Libraries\AuthFlow;

class CustomUserRepository extends Auth0UserRepository
{

    /**
     * Get an existing user or create a new one
     *
     * @param array $profile - Auth0 profile
     *
     * @return User
     */
    protected function upsertUser( $profile ) {
        $results = User::firstOrCreate(['sub' => $profile['sub']], [
            'email' => $profile['email'] ?? '',
            'name' => $profile['name'] ?? '',
        ]);
        return $results;
    }

    /**
     * Authenticate a user with a decoded ID Token
     *
     * @param array $decodedJwt
     *
     * @return Auth0JWTUser
     */
    public function getUserByDecodedJWT(array $decodedJwt) : Authenticatable
    {
        // $user = $this->upsertUser( (array) $jwt );
        // $results = new Auth0JWTUser( $user->getAttributes() );
        // return $results;
        return new Auth0JWTUser($decodedJwt);
    }

    /**
     * Get a User from the database using Auth0 profile information
     *
     * @param array $userinfo
     *
     * @return Auth0User
     */
    public function getUserByUserInfo(array $userinfo) : Authenticatable
    {
        // $user = $this->upsertUser( $userinfo['profile'] );
        // return new Auth0User( $user->getAttributes(), $userinfo['accessToken'] );
        return new Auth0User($userinfo['profile'], $userinfo['accessToken']);
    }

    public function fetchFlowUser()
    {
        $auth0 = new Auth0Service(config('laravel-auth0'));
        $id_token = $auth0->getIdToken();
        $authFLow = new AuthFlow($id_token);
        return $authFLow->fetchFlow();
    }
}

?>
