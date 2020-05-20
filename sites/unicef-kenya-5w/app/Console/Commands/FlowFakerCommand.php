<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\FakerController;
use Faker;

class FlowFakerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flow:faker {total}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed fake survey data (run after flow:init)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info("Preparing for faker data seed process");
        $seed = new FakerController();
        $faker = Faker\Factory::create();
        $seed->seedFakeSurveyData($faker, (int) $this->argument('total'));
        $seed->seedFakeAnswers($faker);
        $this->info("Seeding fake data complete");
    }
}
