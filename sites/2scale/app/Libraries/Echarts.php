<?php
namespace App\Libraries;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;

class Echarts
{
    public function generateBarCharts($legend, $categories, $type, $series)
    {
        $labels = array(
            "normal" => array (
                "show" => true,
                "position" => "inside",
            )
        );
        $series = collect($series)->map(function($data) use ($labels) {
            $data["label"] = $labels;
			return $data;
        });
        $yAxis = array(
            "type" => "value"
        );
        $xAxis = array(
            "type" => "category",
            "data" => $categories
        );
        if ($type === "vertical") {
            $yAxis = array(
                "type" => "category",
                "data" => $categories
            );
            $xAxis = array(
                "type" => "value",
            );
        }
        return [
			"tooltip" => array (
				"trigger" => "axis",
				"axisPointer" => array ("type" => "shadow"),
			),
			"grid" => array(
				"left" => '3%',
				"right" => '4%',
				"bottom" => '3%',
				"containLabel" => true
			),
            "legend" => array(
                "data" => $legend
            ),
            "series" => $series,
            "xAxis" => $xAxis,
            "yAxis" => $yAxis
        ];
    }
}
