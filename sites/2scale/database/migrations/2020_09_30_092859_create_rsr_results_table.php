<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_results', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_project_id');
            $table->unsignedBigInteger('parent_result')->nullable();
            // $table->text('title');
            // $table->longText('description')->nullable();
            $table->unsignedInteger('order')->nullable();
            $table->timestamps();

            $table->foreign('rsr_project_id')->references('id')
                ->on('rsr_projects')->onDelete('cascade');

            $table->foreign('parent_result')->references('id')
                ->on('rsr_results')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_results');
    }
}
