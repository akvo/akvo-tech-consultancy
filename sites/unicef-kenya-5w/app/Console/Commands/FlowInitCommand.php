<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\InitController;
use App\Libraries\Auth;
use App\Libraries\Flow;
use App\Survey;

class FlowInitCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flow:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed initial suryev data';

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
        $this->info("Preparing for initial seed process");
        $init = new InitController();
        $surveys = new Survey();
        $auth = new Auth();
        $flow = new Flow($auth);
        $init->seedSurveyForms($flow, $surveys);
        $this->info("Seeding all tables done");
    }
}
