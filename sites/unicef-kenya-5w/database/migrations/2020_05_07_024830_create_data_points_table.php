<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_points', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('survey_id');
            $table->text('display_name');
            //$table->point('position')->nullable();
            $table->text('position')->nullable();
            $table->timestamps();

            $table->primary('id');
            $table->foreign('survey_id')
                  ->references('id')
                  ->on('surveys')
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
        Schema::dropIfExists('data_points');
    }
}
