<?php

use Illuminate\Database\Seeder;
use App\Partnership;
use App\RsrProject;
use App\RsrResult;
use App\RsrIndicator;
use App\RsrPeriod;
use App\RsrDimension;
use App\RsrDimensionValue;
use App\RsrPeriodDimensionValue;
use App\RsrPeriodData;
use App\Http\Controllers\Api\RsrSeedController;

class RsrTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rsr = new RsrSeedController();
        $partnership = new Partnership();
        $project = new RsrProject(); 
        $result = new RsrResult();  
        $indicator = new RsrIndicator(); 
        $period = new RsrPeriod(); 
        $dimension = new RsrDimension(); 
        $dimensionValue = new RsrDimensionValue(); 
        $periodDimensionValue = new RsrPeriodDimensionValue(); 
        $periodData = new RsrPeriodData();

        $rsr->seedRsr(
            $partnership, $project, $result, $indicator, 
            $period, $dimension, $dimensionValue, 
            $periodDimensionValue, $periodData
        );
    }
}
