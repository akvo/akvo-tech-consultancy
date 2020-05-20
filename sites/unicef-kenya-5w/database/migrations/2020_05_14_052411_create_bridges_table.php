<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBridgesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bridges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_instance_id')->constrained()->onDelete('cascade');
            $table->foreignId('county');
            $table->foreignId('sub_county');
            $table->foreignId('domain');
            $table->foreignId('sub_domain');
            $table->foreignId('value_planned')->nullable();
            $table->foreignId('value_achived')->nullable();
            $table->foreignId('other')->nullable();
            $table->foreignId('beneficiaries_planned');
            $table->foreignId('beneficiaries_achived');
            $table->foreignId('girl_achived');
            $table->foreignId('boy_achived');
            $table->foreignId('woman_achived');
            $table->foreignId('man_achived');
            $table->timestamps();

            $table->foreign('county')
                  ->references('id')
                  ->on('cascades')
                  ->onDelete('cascade');

            $table->foreign('sub_county')
                  ->references('id')
                  ->on('cascades')
                  ->onDelete('cascade');

            $table->foreign('sub_domain')
                  ->references('id')
                  ->on('options')
                  ->onDelete('cascade');

            $table->foreign('value_planned')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('value_achived')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('other')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('beneficiaries_planned')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('beneficiaries_achived')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('girl_achived')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('boy_achived')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('woman_achived')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('man_achived')
                  ->references('id')
                  ->on('answers')
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
        Schema::dropIfExists('bridges');
    }
}
