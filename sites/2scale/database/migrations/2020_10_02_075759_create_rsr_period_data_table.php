<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrPeriodDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_period_data', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_period_id');
            $table->float('value', 12, 2)->nullable();
            $table->longText('text')->nullable();
            $table->timestamps();

            $table->foreign('rsr_period_id')->references('id')
                ->on('rsr_periods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_period_data');
    }
}
