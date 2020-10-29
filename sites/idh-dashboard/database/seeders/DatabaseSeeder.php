<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Http\Controllers\SeedController;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $seeder = new SeedController();
        $seeder->seed();

        \App\Models\User::create([
            'name' => 'Joy',
            'email' => 'joy@akvo.org',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => bcrypt("secret"),
            'active' => true,
            'remember_token' => Str::random(10)
        ]);

        \App\Models\User::create([
            'name' => 'Deden',
            'email' => 'deden@akvo.org',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => bcrypt("secret"),
            'active' => true,
            'remember_token' => Str::random(10)
        ]);

        \App\Models\User::create([
            'name' => 'Galih',
            'email' => 'galih@akvo.org',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => bcrypt("secret"),
            'active' => true,
            'remember_token' => Str::random(10)
        ]);

        \App\Models\User::factory(30)->create();

        $users = \App\Models\User::where('role','guest')->get();
        foreach($users as $user) {
            $forms = \App\Models\Form::get();
            foreach($forms as $form) {
                $faker = \Faker\Factory::create();
                \App\Models\UserForm::create([
                    'user_id' => $user->id,
                    'form_id' => $form->id,
                    'access' => $faker->boolean()
                ]);
            }
        }
    }
}
