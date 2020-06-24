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
        $type = [
            'geo',
            'free',
            'numeric',
            'option',
            'cascade',
            'photo',
            'date',
        ];

        Schema::create('questions', function (Blueprint $table) use ($type) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('form_id');
            $table->unsignedBigInteger('question_group_id');
            $table->unsignedBigInteger('dependency')->nullable();
            $table->text('dependency_answer')->nullable();
            $table->foreignId('cascade_id')->nullable();
            $table->text('name');
            $table->enum('type', $type);
            $table->timestamps();

            $table->primary('id');
            $table->foreign('form_id')
                  ->references('id')
                  ->on('forms')
                  ->onDelete('cascade');

            $table->foreign('question_group_id')
                  ->references('id')
                  ->on('question_groups')
                  ->onDelete('cascade');

            $table->foreign('cascade_id')
                  ->references('id')
                  ->on('cascades')
                  ->onDelete('cascade');

            $table->foreign('dependency')
                  ->references('id')
                  ->on('questions')
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
