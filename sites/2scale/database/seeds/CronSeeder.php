<?php

use Illuminate\Database\Seeder;
use App\Libraries\Akvo;

class CronSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Akvo::updateDataSurvey();
    }
}
