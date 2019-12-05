<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnershipsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partnerships', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('cascade_id');
            $table->bigInteger('parent_id')->unsigned()->nullable()->index();
            $table->string('code')->nullable();
            $table->string('name');
            $table->enum('level', ['country','partnership'])->default('partnership');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('partnerships')
                  ->onDelete('cascade');

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('partnerships');
    }
}
