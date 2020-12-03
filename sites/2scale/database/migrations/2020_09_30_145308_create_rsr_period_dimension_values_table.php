<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrPeriodDimensionValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // mapping disaggragation target value per periods
        Schema::create('rsr_period_dimension_values', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_period_id');
            $table->unsignedBigInteger('rsr_dimension_value_id');
            $table->float('value', 12, 2)->nullable();
            $table->timestamps();

            $table->foreign('rsr_period_id')->references('id')
                ->on('rsr_periods')->onDelete('cascade');
            
            $table->foreign('rsr_dimension_value_id')->references('id')
                ->on('rsr_dimension_values')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_period_dimension_values');
    }
}
