<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $annabelle = new App\User([
            "name" => "Annabelle",
            "email" => "annabelle@akvo.org",
            "email_verified_at" => now(),
            "password" => bcrypt("secret"),
            "remember_token" => Str::random(10),
        ]);

        $deden = new App\User([
            "name" => "Deden",
            "email" => "deden@akvo.org",
            "email_verified_at" => now(),
            "password" => bcrypt("secret"),
            "remember_token" => Str::random(10),
        ]);

        $joy = new App\User([
            "name" => "Joy",
            "email" => "joy@akvo.org",
            "email_verified_at" => now(),
            "password" => bcrypt("secret"),
            "remember_token" => Str::random(10),
        ]);

        $annabelle->save();
        $deden->save();
        $joy->save();
    }
}
