<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Http\Controllers\Api\RsrReportController;

class RsrResult extends Model
{
    protected $hidden = ['created_at','updated_at'];
    // protected $fillable = ['id', 'rsr_project_id', 'parent_result', 'title', 'description', 'order'];
    protected $fillable = ['id', 'rsr_project_id', 'parent_result', 'order'];
    protected $appends = ['title', 'description', 'project'];


    public function rsr_project()
    {
        return $this->belongsTo('\App\RsrProject');
    }

    public function rsr_indicators()
    {
        return $this->hasMany('\App\RsrIndicator');
    }

    public function childrens()
    {
        return $this->hasMany('\App\RsrResult','parent_result','id');
    } 

    public function parents()
    {
        return $this->belongsTo('\App\RsrResult','parent_result','id');
    }

    public function rsr_titles()
    {
        return $this->morphToMany('App\RsrTitle', 'rsr_titleable');
    }

    public function getTitleAttribute($value)
    {
        return Str::replaceLast('.', '', $this->rsr_titles()->pluck('title')[0]);
    }

    public function getDescriptionAttribute($value)
    {
        $desc = $this->rsr_titles()->pluck('description')[0];
        $rsrReport = new RsrReportController();
        $desc = $rsrReport->capitalizeAfterDelimiters($desc, ['.', '. ']);
        if (empty($desc) || $desc == "​" || $desc == null) {
            return $desc;
        }
        return (Str::endsWith($desc, '.')) ? $desc : $desc.'.';
    }

    public function getProjectAttribute($value)
    {
        return Str::replaceLast('.', '', $this->rsr_project()->pluck('title')[0]);
    }
}
