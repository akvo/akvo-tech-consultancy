<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDataSourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_sources', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('source');
            $table->string('type');
            $table->longText('config')->nullable();
            $table->longText('categories')->nullable();
            $table->longText('second_categories')->nullable();
            $table->longText('data')->nullable();
            $table->string('css')->nullable();
            $table->string('js')->nullable();
            $table->timestamp('created_at');
        
            $table->foreign('parent_id')->references('id')->on('data_sources')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_sources');
    }
}
