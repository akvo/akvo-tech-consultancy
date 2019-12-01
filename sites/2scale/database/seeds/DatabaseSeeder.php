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
        //$this->call(CronSeeder::class);
        //$this->call(DataSeeder::class);
        //$this->call(UserTableSeeder::class);
        $this->call(PartnershipTableSeeder::class);
        $this->call(SurveyFormsTableSeeder::class);
        $this->call(QuestionsTableSeeder::class);
        $this->call(QuestionOptionTableSeeder::class);
    }
}
