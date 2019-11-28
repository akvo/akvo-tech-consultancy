<?php

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
        $this->call(CronSeeder::class);
        $this->call(DataSeeder::class);
        $this->call(UserTableSeeder::class);
    }
}
