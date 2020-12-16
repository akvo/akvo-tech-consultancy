<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
        ]);
        \App\Models\User::factory()->create([
            'email' => 'deden@akvo.org',
            'password' => bcrypt('secret'),
        ]);
        \App\Models\User::factory(10)->create();
    }
}
