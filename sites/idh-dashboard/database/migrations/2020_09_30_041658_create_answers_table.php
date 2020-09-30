<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnswersTable extends Migration
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
            $table->unsignedBigInteger('form_instance_id');
            $table->unsignedBigInteger('variable_id');
            $table->float('value')->nullable();
            $table->timestamps();

            $table->foreign('form_instance_id')
                  ->references('id')
                  ->on('form_instances')
                  ->onDelete('cascade');

            $table->foreign('variable_id')
                  ->references('id')
                  ->on('variables')
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
        Schema::dropIfExists('answers');
    }
}
