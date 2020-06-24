<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FlowFakerCleanCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flow:clean {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans All Datapoints (Require CLEAN_PASSWORD environment)';

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
        if ($this->argument('password') === env('CLEAN_PASSWORD')) {
            $counts = \App\DataPoint::count();
            $dataPoints = \App\DataPoint::query();
            $this->info("Removing ".$counts." DataPoints".PHP_EOL);
            $dataPoints->delete();
            $this->info($counts." Datapoints removed");
        }
        $this->info("Password is wrong".PHP_EOL);
    }
}
