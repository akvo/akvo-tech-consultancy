<?php

namespace Akvo\Commands;

use Illuminate\Support\ServiceProvider;

class AkvoFlowServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('command.akvo.akvo-flow-php-sdk.migrations', function($app){
            return $app['Akvo\Commands\AkvoFlowMigrations'];
        });
        $this->commands('command.akvo.akvo-flow-php-sdk.migrations');

        $this->app->singleton('command.akvo.akvo-flow-php-sdk.api', function($app){
            return $app['Akvo\Commands\AkvoFlowApi'];
        });
        $this->commands('command.akvo.akvo-flow-php-sdk.api');
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}

