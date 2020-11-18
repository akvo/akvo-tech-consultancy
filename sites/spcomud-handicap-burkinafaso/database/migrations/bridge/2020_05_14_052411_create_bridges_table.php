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

            foreach(config('query.data') as $data){
                $table->unsignedBigInteger($data['name']);
                $table->foreign($data['name'])
                      ->references('id')
                      ->on($data['on'])
                      ->onDelete('cascade');
            }

            foreach(config('query.values') as $value){
                if (!$value['on']) {
                    switch($value['type']) {
                    case 'integer':
                        $table->BigInteger($value['name']);
                        break;
                    case 'date':
                        $table->date($value['name']);
                        break;
                    default:
                        $table->text($value['name']);
                        break;
                    }
                } 
                if ($value['on']) {
                    $table->unsignedBigInteger($value['name'])->nullable();
                    // $table->foreign($value['name'])
                    //       ->references('id')
                    //       ->on($value['on'])
                    //       ->onDelete('cascade');
                }
            }

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
        Schema::dropIfExists('bridges');
    }
}
