<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrPeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_periods', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('rsr_indicator_id');
            $table->unsignedBigInteger('parent_period')->nullable();
            $table->float('target_value', 12, 2)->nullable();
            $table->float('actual_value', 12, 2)->nullable();
            $table->date('period_start')->nullable();
            $table->date('period_end')->nullable();
            $table->timestamps();

            $table->foreign('rsr_indicator_id')->references('id')
                ->on('rsr_indicators')->onDelete('cascade');

            $table->foreign('parent_period')->references('id')
                ->on('rsr_periods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_periods');
    }
}
