<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Answers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('survey_session_id');
            $table->bigInteger('question_id');
            $table->bigInteger('dependency');
            $table->bigInteger('order');
            $table->boolean('mandatory');
            $table->text('type');
            $table->text('input');
            $table->timestamp('created_at', 0)->useCurrent();
        });

        Schema::table(
            'answers', function (Blueprint $table) {
                $table->foreign('survey_session_id')
                    ->references('id')
                    ->on('survey_sessions')
                    ->onDelete('cascade');
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('answers');
    }
}
