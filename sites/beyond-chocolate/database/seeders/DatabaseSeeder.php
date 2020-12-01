<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Http\Controllers\SeedController as Seed;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Seed Organizations
        $seed = new Seed();
        $seed->seedOrganizations();
        
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
