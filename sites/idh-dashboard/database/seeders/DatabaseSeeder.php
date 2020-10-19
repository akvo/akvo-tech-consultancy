<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Http\Controllers\SeedController;

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

        $users = \App\Models\User::factory(3)->create();
        foreach($users as $user) {
            $forms = \App\Models\Form::get();
            foreach($forms as $form) {
                \App\Models\UserForm::create([
                    'user_id' => $user->id,
                    'form_id' => $form->id,
                    'download' => true
                ]);
            }
        }
    }
}
