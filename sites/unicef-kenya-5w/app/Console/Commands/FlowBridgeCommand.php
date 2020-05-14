<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\BridgeController;

class FlowBridgeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flow:bridge';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run seed for additional table (bridges table)';

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
        $this->info("Preparing data");
        $seed = new BridgeController();
        $seed->startSeed();
        $this->info("Seed additional table (bridges table) done");
    }
}
