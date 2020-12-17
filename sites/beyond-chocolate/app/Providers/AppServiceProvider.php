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
        //
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
            // this is what is currently being done
            // adjust for your needs
            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject('Verify Email Address – Emailadresse bestätigen')
                ->line('Please click the button below to verify your email address.')
                ->line('Bitte klicken Sie auf dieses Feld um Ihre Emailadresse zu bestätigen.')
                ->action(
                    'Verify Email Address/ Emailadresse bestätigen',
                    $this->verificationUrl($notifiable)
                )
                ->line('If you did not create an account, no further action is required.')
                ->line('Wenn sie keine Registrierung vorgenommen haben, ignorieren Sie bitte diese Email.');
        });
    }
}
