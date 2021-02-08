<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        /**
         * Override Login
         */
        $this->app->bind(
            \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::class,
            \App\Http\Controllers\AuthenticatedSessionController::class
        );

        /**
         * Override DataPointSeeder
         */
        $this->app->bind(
            \Akvo\Seeds\DataPointSeeder::class,
            \App\Seeds\DataPointSeeder::class
        );

        /**
         * Override FormSeeder
         */
        $this->app->bind(
            \Akvo\Seeds\FormSeeder::class,
            \App\Seeds\FormSeeder::class
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        /**
         * Override the email notification for verifying email
         */
        \Illuminate\Auth\Notifications\VerifyEmail::toMailUsing(function ($notifiable) {
            $verifyUrl = \URL::temporarySignedRoute(
                'verification.verify',
                \Illuminate\Support\Carbon::now()->addMinutes(\Illuminate\Support\Facades\Config::get('auth.verification.expire', 60)),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );
            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject('Verify Email Address – Emailadresse bestätigen')
                ->line('Please click the button below to verify your email address.')
                // ->line('Bitte klicken Sie auf dieses Feld um Ihre Emailadresse zu bestätigen.')
                ->action(
                    'Verify Email Address',
                    $verifyUrl
                )
                ->line('If you did not create an account, no further action is required.');
                // ->line('Wenn sie keine Registrierung vorgenommen haben, ignorieren Sie bitte diese Email.');
        });
    }
}
