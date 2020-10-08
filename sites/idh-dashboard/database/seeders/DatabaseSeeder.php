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
        //$seeder = new SeedController();
        //$seeder->seed();

        $users = \App\Models\User::factory(3)->create();
        $admin = \App\Models\Role::create(['type' => 'admin']);
        $member = \App\Models\Role::create(['type' => 'member']);
        $user = \App\Models\Role::create(['type' => 'user']);
        $roles = [$admin, $member, $user];
        foreach($users as $index => $user) {
            \App\Models\UserRole::create([
                'user_id' => $user->id,
                'role_id' => $roles[$index]->id,
            ]);
            if ($index > 0) {
                $form = \App\Models\Form::inRandomOrder()->first();
                \App\Models\UserForm::create([
                    'user_id' => $user->id,
                    'form_id' => $form->id
                ]);
            }
        }
    }
}
