<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnswerOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answer_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('answer_id');
            $table->foreignId('option_id');
            $table->timestamps();

            $table->foreign('answer_id')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('option_id')
                  ->references('id')
                  ->on('options')
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
        Schema::dropIfExists('answer_options');
    }
}
