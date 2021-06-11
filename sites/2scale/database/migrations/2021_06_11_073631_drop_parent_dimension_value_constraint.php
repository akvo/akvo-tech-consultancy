<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropParentDimensionValueConstraint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rsr_dimension_values', function (Blueprint $table) {
            $table->dropForeign('rsr_dimension_values_parent_dimension_value_foreign');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rsr_dimension_values', function (Blueprint $table) {
            $table->foreign('parent_dimension_value')->references('id')
                ->on('rsr_dimension_values')->onDelete('cascade');
        });
    }
}
