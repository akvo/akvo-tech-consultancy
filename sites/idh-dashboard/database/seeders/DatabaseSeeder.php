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
        // \App\Models\User::factory(10)->create();
        $seeder = new SeedController();
        $seeder->seed();
    }
}
