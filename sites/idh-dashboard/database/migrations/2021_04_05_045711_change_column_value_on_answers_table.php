<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeColumnValueOnAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->float('value', 8, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->float('value')->nullable()->change();
        });
    }
}
