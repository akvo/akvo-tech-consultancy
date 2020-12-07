<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('web_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrainded();
            $table->foreignId('organization_id')->constrained();
            $table->unsignedBigInteger('form_id');
            $table->string('form_instance_id');
            $table->string('form_instance_url');
            $table->boolean('submitted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('web_forms');
    }
}
