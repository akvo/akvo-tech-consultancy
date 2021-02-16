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
        /* Deprecated
        $this->call(CronSeeder::class);
        $this->call(DataSeeder::class);
        $this->call(UserTableSeeder::class);
         */

        /* Sync */
        $this->call(PartnershipTableSeeder::class);
        $this->call(SectorTableSeeder::class);
        $this->call(SurveyFormsTableSeeder::class);
        $this->call(QuestionsTableSeeder::class);
        $this->call(QuestionOptionTableSeeder::class);
        $this->call(DatapointsTableSeeder::class);
        // seeding Rsr data
        $this->call(RsrTableSeeder::class);

        /* Faker Test Datapoint */
        // $this->call(TestDatapointsTableSeeder::class);
    }
}
