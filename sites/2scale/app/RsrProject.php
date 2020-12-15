<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RsrProject extends Model
{
    protected $hidden = ['created_at','updated_at'];
    protected $fillable = ['id', 'partnership_id', 'title','subtitle', 'currency', 'budget','funds',
                            'funds_needed', 'project_plan_summary', 'goals_overview', 'background',
                            'sustainability', 'current_image', 'current_image_caption', 'status_label',
                            'date_start_planned', 'date_start_actual', 'date_end_planned', 'date_end_actual',
                        ];

    public function partnership()
    {
        return $this->belongsTo('\App\Partnership');
    }

    public function rsr_results()
    {
        return $this->hasMany('\App\RsrResult');
    }
}
