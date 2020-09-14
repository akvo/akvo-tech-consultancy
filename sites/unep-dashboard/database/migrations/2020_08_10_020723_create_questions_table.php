<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->unsignedBigInteger('value_id')->nullable();
            $table->string('code')->nullable();
            $table->text('name');
            $table->string('type');
            $table->timestamps();

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('questions')
                  ->onDelete('cascade');
            $table->foreign('value_id')
                  ->references('id')
                  ->on('values')
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
        Schema::dropIfExists('questions');
    }
}
