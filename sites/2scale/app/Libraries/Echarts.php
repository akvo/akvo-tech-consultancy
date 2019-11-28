<?php
namespace App\Libraries;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;

class Echarts
{
    public function generateBarCharts($legend, $categories, $type, $series)
    {
        $textStyle = array(
            "fontFamily" => "sans-serif",
            "fontWeight" => 200
        );
        $legendStyle = array(
            "fontFamily" => "sans-serif",
            "fontWeight" => 200,
            "fontSize" => 14,
        );
        $labels = array(
            "normal" => array (
                "show" => true,
                "position" => "inside",
            )
        );
        $series = collect($series)->map(function($data) use ($labels) {
            $data["label"] = $labels;
            $data["type"] = "bar";
			return $data;
        });
        $yAxis = array(
            "type" => "value",
            "axisLabel" => $textStyle 
        );
        $xAxis = array(
            "type" => "category",
            "data" => $categories,
            "axisLabel" => $textStyle,
            "axisTick" => array( "show" => false)
        );
        if ($type === "Horizontal") {
            $yAxis = array(
                "type" => "category",
                "data" => $categories,
                "axisLabel" => $textStyle,
                "axisTick" => array( "show" => false)
            );
            $xAxis = array(
                "type" => "value",
                "axisLabel" => $textStyle 
            );
        }
        return [
            "color" => array (
                '#ff4444','#ffbb33', '#00C851', '#33b5e5', '#2BBBAD','#4285F4',  '#aa66cc', '#ff7043','#b2dfdb', '#b3e5fc', '#8d6e63'
            ),
            "dataZoom" => array(
                "type" => 'inside',
                "yAxisIndex" => [0]
            ),
			"tooltip" => array (
				"trigger" => "axis",
				"axisPointer" => array ("type" => "shadow"),
			),
			"grid" => array(
				"left" => '3%',
				"bottom" => '20.5%',
				"right" => '4%',
				"top" => '3%',
				"containLabel" => true
			),
            "legend" => array(
                "bottom" => 0,
				"left" => '3%',
                "textStyle" => $legendStyle,
                "icon" => "circle",
                "data" => $legend
            ),
            "toolbox" => array(
                "show" => true,
                "feature" => array( 
                    "saveAsImage" => array( "show" =>  true, "title" => "Save")
                ),
                "bottom" => 0, 
                "right" => 0, 
            ),
            "series" => $series,
            "xAxis" => $xAxis,
            "yAxis" => $yAxis
        ];
    }
    public function generateMapCharts($data, $min, $max){
        $data = collect($data)->map(function($dt){
            $dt = collect($dt);
            $dt["emphasis"] = array(
                'label' => array(
                    'show' => true,
                    'fontSize' => 14,
                	'fontWeight' => 400,
					'color' => '#fff'
                ),
            );
            $dt["label"] = array(
                'show' => true,
                'fontSize' => 12,
				'color' => '#fff'
            );
			$dt["itemStyle"] = array(
				'emphasis' => array(
                    "shadowOffsetX" =>  0,
                    "shadowOffsetY" => 0,
                    "shadowBlur" => 50,
                    "borderWidth" => 2,
                    "borderColor" => "#FFF",
                    "shadowColor" => "rgba(0, 0, 0, .7)",
				)
			);
            return $dt; 
        })->toArray();
        return array (
          'visualMap' => array (
            'min' => $min,
            'max' => $max,
            'text' => array ('High','Low'),
            'realtime' => false,
            'calculable' => true,
            'inRange' => array(
                'color' => array('#ff4444','#33b5e5', '#2BBBAD'),
            ),
          ),
          'tooltip' => array (
            'trigger' => 'item',
            'showDelay' => 0,
            'transitionDuration' => 0.2,
          ),
          'toolbox' => array (
            'show' => true,
            'right' => 'right',
            'bottom' => 'bottom',
            'feature' => array (
                'saveAsImage' => array(
                    'title' => 'Save Image',
                ),
            ),
          ),
          'series' => array(
            array(
              'type' => 'map',
              'zoom' => 1.2,
              'room' => true,
              'aspectScale' => 1,
              'map' => 'africa',
              'data' => $data, 
            ),
          ),
        );
    }
}
