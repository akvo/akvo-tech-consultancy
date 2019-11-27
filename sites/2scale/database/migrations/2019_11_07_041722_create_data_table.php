<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('question_id');
            $table->unsignedBigInteger('datapoint_id');
            $table->unsignedBigInteger('form_id');
            $table->text('answer');
            $table->char('country', 50);
            $table->date('submission_date');
            $table->timestamps();
            $table->foreign('question_id')->references('question_id')
                ->on('questions')->onDelete('cascade');

            $table->foreign('form_id')->references('form_id')
                ->on('forms')->onDelete('cascade');
            $table->index('country');
            $table->index('created_at');
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
        Schema::dropIfExists('data');
    }
}
