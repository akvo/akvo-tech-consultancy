<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('survey_group_id');
            $table->unsignedBigInteger('form_id')->unique();
            $table->unsignedBigInteger('survey_id')->unique();
            $table->text('name');
            $table->unsignedBigInteger('partner_qid');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('survey_group_id')->references('id')
                ->on('survey_groups')->onDelete('cascade');

            $table->index('form_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('forms');
    }
}
