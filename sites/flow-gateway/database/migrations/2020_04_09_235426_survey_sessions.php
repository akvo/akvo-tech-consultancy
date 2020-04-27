<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SurveySessions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('survey_sessions', function (Blueprint $table) {
            $table->id();
            $table->text('session_id');
            $table->enum('service', ['africastalking','twilio']);
            $table->enum('type', ['sms','ussd','whatsapp']);
            $table->text('instance_name');
            $table->text('app');
            $table->bigInteger('form_id');
            $table->text('form_name');
            $table->text('version');
            $table->bigInteger('phone_number');
            $table->text('uuid')->nullable();
            $table->boolean('complete')->default(0);
            $table->timestamp('created_at', 0)->useCurrent();
            $table->timestamp('updated_at', 0)->useCurrent();
            $table->timestamp('synced_at', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('survey_sessions');
    }
}
