<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\FakerController;

class FlowFakerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flow:faker {total} {repeat}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed fake survey data (require flow:init)';

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
        $data = new FakerController($this->argument('total'), $this->argument('repeat'));
        $data->seed();
        $this->info("Seeding fake data complete");
    }
}
