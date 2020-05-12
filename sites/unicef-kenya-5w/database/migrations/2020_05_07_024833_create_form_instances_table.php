<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('form_instances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_id');
            $table->unsignedBigInteger('data_point_id');
            $table->string('identifier');
            $table->text('submitter')->nullable();
            $table->text('device');
            $table->timestamp('submission_date');
            $table->unsignedInteger('survey_time');
            $table->timestamps();

            $table->foreign('form_id')
                  ->references('id')
                  ->on('forms')
                  ->onDelete('cascade');

            $table->foreign('data_point_id')
                  ->references('id')
                  ->on('data_points')
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
        Schema::dropIfExists('form_instances');
    }
}
