<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Data extends Model
{
    protected $table = 'data';
    protected $fillable = ['question_id', 'datapoint_id', 'form_id' ,'answer', 'country', 'submission_date'];
    protected $hidden = ['created_at', 'updated_at'];

    public function question() {
        return $this->belongsTo('App\Question', 'question_id', 'question_id');
    } 

    public function forms() {
        return $this->belongsTo('App\Form', 'form_id','form_id');
    }

    public function country() {
        return $this->groupBy('country');
    }

    public function datapoints() {
        return $this->select('datapoint_id')->groupBy('datapoint_id');
    }

    public function answers($datapoint_id) {
        return $this->where('datapoint_id', $datapoint_id);
    }

}
