<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnswerCascadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answer_cascades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('answer_id');
            $table->foreignId('cascade_id');
            $table->timestamps();

            $table->foreign('answer_id')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('cascade_id')
                  ->references('id')
                  ->on('cascades')
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
        Schema::dropIfExists('answer_cascades');
    }
}
