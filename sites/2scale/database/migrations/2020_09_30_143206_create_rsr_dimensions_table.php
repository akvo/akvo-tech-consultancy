<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrDimensionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_dimensions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_indicator_id');
            $table->unsignedBigInteger('rsr_project_id');
            $table->unsignedBigInteger('parent_dimension_name')->nullable();
            // $table->text('name');
            $table->timestamps();

            $table->foreign('rsr_indicator_id')->references('id')
                ->on('rsr_indicators')->onDelete('cascade');

            $table->foreign('parent_dimension_name')->references('id')
                ->on('rsr_dimensions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_dimensions');
    }
}
