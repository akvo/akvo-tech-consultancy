<?php

namespace Akvo\Commands;

use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Akvo\Migrations\AkvoFlowDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class AkvoFlowMigrations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'akvo:migrate {--clear}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create database migration schema for Akvo Flow';

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
        $options = $this->options();
        $migrator = new AkvoFlowDatabase();
        if ($options['clear']) {
            $migrator->teardown();
            return;
        };
        if(Schema::hasTable('surveys')) {
            $this->error('Your database contains surveys table or you already migrate Flow Database');
            $drop = $this->confirm('Do you want to drop all the flow database?');
            if ($drop){
                $migrator->teardown();
                $migrator->migrate();
            }
            return;
        };
        $migrator->migrate();
    }
}

