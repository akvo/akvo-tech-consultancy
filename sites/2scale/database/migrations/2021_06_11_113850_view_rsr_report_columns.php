<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ViewRsrReportColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement(
            "
                create or replace view rsr_report_columns as
                select t.title, r.id, r.rsr_project_id, r.order, ri.id as `indicator_id`,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', sub.name,
                        'values', sub.values
                    )
                ) as `subtitles`
                from rsr_results r
                left join rsr_indicators ri on r.id = ri.rsr_result_id--
                left join rsr_titleables rt on r.id = rt.rsr_titleable_id
                left join rsr_titles t on rt.rsr_title_id = t.id
                left join ((
                    select d.rsr_project_id, d.rsr_indicator_id, d.id, n.title as `name`, JSON_ARRAYAGG(dv.title) as `values`
                    from rsr_dimensions d
                    left join (
                        select t.title, rt.rsr_titleable_id from rsr_titleables rt
                        left join rsr_titles t on rt.rsr_title_id = t.id
                    ) as n on d.id = n.rsr_titleable_id
                    left join (
                        select rdv.rsr_dimension_id, t.title
                        from rsr_dimension_values rdv
                        left join rsr_titleables rt on rdv.id = rt.rsr_titleable_id
                        left join rsr_titles t on rt.rsr_title_id = t.id
                    ) as dv on d.id = dv.rsr_dimension_id
                    group by n.title, d.rsr_project_id, d.rsr_indicator_id, d.id
                )) as sub on ri.id = sub.rsr_indicator_id
                group by t.title, r.id, r.rsr_project_id, r.order, ri.id ;
            "
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \DB::statement("DROP VIEW IF EXISTS `rsr_report_columns`;");
    }
}
