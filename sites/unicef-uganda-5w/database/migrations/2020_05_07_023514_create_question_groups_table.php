<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_groups', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('form_id');
            $table->text('name');
            $table->boolean('repeat');
            $table->timestamps();

            $table->primary('id');
            $table->foreign('form_id')
                  ->references('id')
                  ->on('forms')
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
        Schema::dropIfExists('question_groups');
    }
}
