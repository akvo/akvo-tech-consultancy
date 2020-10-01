<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRsrProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rsr_projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('partnership_id');
            $table->text('title');
            $table->text('subtitle')->nullable();
            $table->float('budget')->default(0);
            $table->float('funds')->default(0);
            $table->float('funds_needed')->default(0);
            $table->text('currency');
            $table->longText('project_plan_summary')->nullable();
            $table->longText('goals_overview')->nullable();
            $table->longText('background')->nullable();
            $table->longText('sustainability')->nullable();
            $table->text('current_image')->nullable();
            $table->text('current_image_caption')->nullable();
            $table->text('status_label')->nullable();
            $table->date('date_start_planned');
            $table->date('date_start_actual');
            $table->date('date_end_planned');
            $table->date('date_end_actual');
            $table->timestamps();

            $table->foreign('partnership_id')->references('id')
                ->on('partnerships')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rsr_projects');
    }
}
