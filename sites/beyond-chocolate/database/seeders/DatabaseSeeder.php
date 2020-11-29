<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory()->create([
            'email' => 'joy@akvo.org',
            'password' => bcrypt('secret'),
            'role' => Role::get('admin')
        ]);
        \App\Models\User::factory()->create([
            'email' => 'deden@akvo.org',
            'password' => bcrypt('secret'),
            'role'=> Role::get('admin')
        ]);
        \App\Models\User::factory()->create([
            'email' => 'galih@akvo.org',
            'password' => bcrypt('secret'),
            'role'=> Role::get('admin')
        ]);
        \App\Models\User::factory(20)->create();
    }
}
