<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDatapointValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datapoint_values', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('datapoint_id');
            $table->unsignedBigInteger('value_id');

            $table->foreign('value_id')
                  ->references('id')
                  ->on('values')
                  ->onDelete('cascade');
            $table->foreign('datapoint_id')
                  ->references('id')
                  ->on('datapoints')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('datapoint_values');
    }
}
