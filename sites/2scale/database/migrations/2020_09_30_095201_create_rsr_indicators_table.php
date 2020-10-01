<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrIndicatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_indicators', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_result_id');
            $table->unsignedBigInteger('parent_indicator')->nullable();
            $table->text('title');
            $table->longText('description');
            $table->year('baseline_year');
            $table->float('baseline_value');
            $table->float('target_value');
            $table->unsignedInteger('order')->nullable();
            $table->boolean('has_dimension');
            $table->timestamps();

            $table->foreign('rsr_result_id')->references('id')
                ->on('rsr_results')->onDelete('cascade');
            
            $table->foreign('parent_indicator')->references('id')
                ->on('rsr_indicators')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_indicators');
    }
}
