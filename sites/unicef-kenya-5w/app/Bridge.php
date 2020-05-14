<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bridge extends Model
{
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['form_instance_id', 'county', 'sub_county', 'domain', 'sub_domain', 'value_planned', 'value_achived', 'other', 'beneficiaries_planned', 'beneficiaries_achived', 'girl_achived', 'boy_achived', 'woman_achived', 'man_achived'];

    public function formInstance()
    {
        return $this->belongsTo('App\FormInstance');
    }

    public function cascade()
    {
        return $this->belongsTo('App\Cascade');
    }

    public function option()
    {
        return $this->belongsTo('App\Option');
    }

    public function answer()
    {
        return $this->belongsTo('App\Answer');
    }
}
