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
        Schema::create('datapoints', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('survey_group_id');
            $table->unsignedBigInteger('form_id');
            $table->unsignedBigInteger('country_id')->nullable();
            $table->unsignedBigInteger('partnership_id')->nullable();
            $table->unsignedBigInteger('datapoint_id');
            $table->char('organisation', 50)->nullable();
            $table->date('submission_date');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('form_id')->references('form_id')
                ->on('forms')->onDelete('cascade');

            $table->foreign('survey_group_id')->references('id')
                ->on('survey_groups')->onDelete('cascade');

            $table->foreign('country_id')->references('id')
                ->on('partnerships')->onDelete('cascade');

            $table->foreign('partnership_id')->references('id')
                ->on('partnerships')->onDelete('cascade');

            $table->index('created_at');
            $table->index('datapoint_id');
            $table->index('submission_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('datapoints');
    }
}
