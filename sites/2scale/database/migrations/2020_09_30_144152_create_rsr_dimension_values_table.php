<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrDimensionValuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_dimension_values', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_dimension_id');
            $table->unsignedBigInteger('parent_dimension_value')->nullable();
            // $table->text('name'); // from dimension value
            $table->float('value', 12, 2)->nullable(); // from disaggregation target value map by dimension_value
            $table->timestamps();

            $table->foreign('rsr_dimension_id')->references('id')
                ->on('rsr_dimensions')->onDelete('cascade');

            $table->foreign('parent_dimension_value')->references('id')
                ->on('rsr_dimension_values')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_dimension_values');
    }
}
