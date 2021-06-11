<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropParentDimensionNameConstraint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rsr_dimensions', function (Blueprint $table) {
            $table->dropForeign('rsr_dimensions_parent_dimension_name_foreign');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rsr_dimensions', function (Blueprint $table) {
            $table->foreign('parent_dimension_name')->references('id')
                ->on('rsr_dimensions')->onDelete('cascade');
        });
    }
}
