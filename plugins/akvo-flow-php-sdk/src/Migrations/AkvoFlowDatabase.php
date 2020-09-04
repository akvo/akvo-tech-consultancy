<?php

namespace Akvo\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AkvoFlowDatabase extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function migrate()
    {
        $this->info("Migrating Flow Database");
        /**
         * create surveys table
         */
        Schema::create('surveys', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->text('name');
            $table->unsignedBigInteger('registration_id')->nullable();
            $table->timestamps();
            $table->primary('id');
        });
        $this->info("1. Survey table created");

        /**
         * create forms table
         */
        Schema::dropIfExists('forms');
        Schema::create('forms', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('survey_id');
            $table->text('name');
            $table->timestamps();

            $table->primary('id');
            $table->foreign('survey_id')
                  ->references('id')
                  ->on('surveys')
                  ->onDelete('cascade');
        });
        $this->info("2. Forms table created");

        /**
         * create cascade table
         */
        Schema::create('cascades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable();
            $table->string('code')->nullable();
            $table->text('name');
            $table->unsignedTinyInteger('level')->nullable();
            $table->timestamps();

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('cascades')
                  ->onDelete('cascade');
        });
        $this->info("3. Cascade Table Created");

        /**
         * create question groups table
         */
        Schema::create('question_groups', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('form_id');
            $table->text('name');
            $table->boolean('repeat');
            $table->timestamps();

            $table->primary('id');
            $table->foreign('form_id')
                  ->references('id')
                  ->on('forms')
                  ->onDelete('cascade');
        });

        $this->info("4. Question Groups table created");

        /**
         * create questions table
         */
        $type = [ 'geo', 'free', 'numeric', 'option', 'cascade', 'photo', 'date'];
        Schema::create('questions', function (Blueprint $table) use ($type) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('form_id');
            $table->unsignedBigInteger('question_group_id');
            $table->unsignedBigInteger('dependency')->nullable();
            $table->text('dependency_answer')->nullable();
            $table->foreignId('cascade_id')->nullable();
            $table->text('name');
            $table->enum('type', $type);
            $table->timestamps();

            $table->primary('id');
            $table->foreign('form_id')
                  ->references('id')
                  ->on('forms')
                  ->onDelete('cascade');

            $table->foreign('question_group_id')
                  ->references('id')
                  ->on('question_groups')
                  ->onDelete('cascade');

            $table->foreign('cascade_id')
                  ->references('id')
                  ->on('cascades')
                  ->onDelete('cascade');

            $table->foreign('dependency')
                  ->references('id')
                  ->on('questions')
                  ->onDelete('cascade');
        });
        $this->info("5. Questions Table Created");

        /**
         * create options table
         */
        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id');
            $table->string('code')->nullable();
            $table->text('name');
            $table->boolean('other');
            $table->timestamps();

            $table->foreign('question_id')
                  ->references('id')
                  ->on('questions')
                  ->onDelete('cascade');
        });
        $this->info("6. Options Table Created");

        /**
         * create datapoints table
         */
        Schema::create('data_points', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedBigInteger('survey_id');
            $table->text('display_name');
            $table->text('position')->nullable();
            $table->timestamps();

            $table->primary('id');
            $table->foreign('survey_id')
                  ->references('id')
                  ->on('surveys')
                  ->onDelete('cascade');
        });
        $this->info("7. Datapoints Table Created");


        /**
         * create form instances table
         */
        Schema::create('form_instances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fid');
            $table->unsignedBigInteger('form_id');
            $table->unsignedBigInteger('data_point_id');
            $table->string('identifier');
            $table->text('submitter')->nullable();
            $table->text('device');
            $table->timestamp('submission_date');
            $table->unsignedInteger('survey_time');
            $table->timestamps();

            $table->foreign('form_id')
                  ->references('id')
                  ->on('forms')
                  ->onDelete('cascade');

            $table->foreign('data_point_id')
                  ->references('id')
                  ->on('data_points')
                  ->onDelete('cascade');
        });
        $this->info("8. Form Instances Table Created");

        /**
         * create answers table
         */
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_instance_id');
            $table->unsignedBigInteger('question_id');
            $table->text('name')->nullable();
            $table->bigInteger('value')->nullable();
            $table->unsignedInteger('repeat_index')->default(0);
            $table->timestamps();

            $table->foreign('question_id')
                  ->references('id')
                  ->on('questions')
                  ->onDelete('cascade');

            $table->foreign('form_instance_id')
                  ->references('id')
                  ->on('form_instances')
                  ->onDelete('cascade');
        });
        $this->info("9. Answers Table Created");

        /**
         * create answer options
         */
        Schema::create('answer_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('answer_id');
            $table->foreignId('option_id');
            $table->timestamps();

            $table->foreign('answer_id')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('option_id')
                  ->references('id')
                  ->on('options')
                  ->onDelete('cascade');
        });
        $this->info("10. Answer Options Table Created");


        /**
         * create answer cascades
         */
        Schema::create('answer_cascades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('answer_id');
            $table->foreignId('cascade_id');
            $table->timestamps();

            $table->foreign('answer_id')
                  ->references('id')
                  ->on('answers')
                  ->onDelete('cascade');

            $table->foreign('cascade_id')
                  ->references('id')
                  ->on('cascades')
                  ->onDelete('cascade');
        });
        $this->info("10. Answer Cascades Table Created");

        /**
         * create answer cascades
         */
        Schema::create('syncs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('survey_id');
            $table->text('url');
            $table->timestamps();

            $table->foreign('survey_id')
                  ->references('id')
                  ->on('surveys')
                  ->onDelete('cascade');
        });
        $this->info("10. Syncs Table Created");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function teardown()
    {
        $this->info("Drop all Akvo Flow Schema");

        Schema::dropIfExists('syncs');
        Schema::dropIfExists('answer_cascades');
        Schema::dropIfExists('answer_options');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('form_instances');
        Schema::dropIfExists('data_points');
        Schema::dropIfExists('options');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('cascades');
        Schema::dropIfExists('question_groups');
        Schema::dropIfExists('forms');
        Schema::dropIfExists('surveys');
    }

    private function info($log) {
        echo($log.PHP_EOL);
    }
}
