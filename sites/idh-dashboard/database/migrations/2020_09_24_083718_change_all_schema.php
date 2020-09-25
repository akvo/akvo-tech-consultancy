<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Akvo\Migrations\AkvoFlowDatabase;



class ChangeAllSchema extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $migrator = new AkvoFlowDatabase();
        $migrator->migrate();
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('failed_jobs');

        Schema::table('form_instances', function (Blueprint $table){
            $table->dropForeign(['data_point_id']);
            $table->dropColumn('fid');
            $table->dropColumn('submitter');
            $table->dropColumn('device');
            $table->dropColumn('submission_date');
            $table->dropColumn('survey_time');
            $table->dropColumn('data_point_id');
        });

        Schema::table('variables', function(Blueprint $table) {
            $table->enum('type', ['option','numeric'])->after('name')->nullable();
        });

        Schema::dropIfExists('data_points');
        Schema::dropIfExists('answer_options');
        Schema::dropIfExists('answer_cascades');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('syncs');
        //
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
