<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariableOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('variable_options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variable_id');
            $table->text('name');
            $table->timestamps();

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
        Schema::dropIfExists('custom_variable_options');
    }
}
