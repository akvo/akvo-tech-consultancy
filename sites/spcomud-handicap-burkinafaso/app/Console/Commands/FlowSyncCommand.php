<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\Auth;
use App\Libraries\Flow;

class FlowSyncCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flow:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updating survey data';

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
        $this->info("Preparing sync process");
        $sync = new SyncController();
        $auth = new Auth();
        $flow = new Flow($auth);
        $sync->syncData($flow);
        $this->info("Flow Sync function not done yet");
    }
}
