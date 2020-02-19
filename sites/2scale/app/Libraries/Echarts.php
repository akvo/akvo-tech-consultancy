<?php
namespace App\Libraries;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;

class Echarts
{
    public function __construct(){
        $this->pallete = array(
            '#ff4444','#ffbb33', '#00C851', '#33b5e5', '#2BBBAD','#4285F4',  '#aa66cc', '#ff7043','#b2dfdb', '#b3e5fc', '#8d6e63','#f78bba','#231fa1'
        );
    }
    private function generateLegend($legend, $textStyle, $orient = 'horizontal', $x = 'center', $y = 'top') {
        return array(
            'orient' => $orient,
            'x' => $x,
            'y' => $y,
            'textStyle' => $textStyle,
            'data' => $legend,
            'icon' => 'circle',
        );
    }
    public function generateDonutCharts($legend, $data){
        $legend = collect($legend)->map(function($l){
            return $this->titler($l);
        });
        $data = collect($data)->map(function($d){
            $d['name'] = $this->titler($d['name']);
            return $d;
        });
        $legendStyle = array(
            'fontFamily' => 'sans-serif',
            'fontWeight' => 200,
            'fontSize' => 14,
        );
        return array (
          'color' => $this->pallete, 
          'tooltip' => array ( 'trigger' => 'item'),
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
          'legend' => $this->generateLegend($legend, $legendStyle, 'vertical', 'left', 'top'),
          'series' => array (
            array (
              'type' => 'pie',
              'radius' => array ( '40%', '70%'),
              'avoidLabelOverlap' => false,
              'label' => 
              array (
                'normal' => 
                array (
                    'show' => true,
                    'position' => 'inside'
                ),
                'emphasis' => 
                array (
                  'show' => true,
                  'textStyle' => 
                  array (
                    'fontSize' => '20',
                    'fontWeight' => 'bold',
                  ),
                ),
              ),
              'labelLine' => 
              array (
                'normal' => 
                array (
                  'show' => false,
                ),
              ),
              'data' => $data 
            ),
          ),
        );
    }
    public function generateSimpleBarCharts($categories, $values) 
	{
        $categories = $categories->map(function($l) {
            return $this->titler($l);
        });
		return [
            'dataZoom' => array(
                'type' => 'inside',
                'yAxisIndex' => [0]
            ),
			'tooltip' => array (
				'trigger' => 'axis',
				'axisPointer' => array ('type' => 'shadow'),
			),
			"grid" => array (
				"left" => "50%",
				"top" => "0px",
				"bottom" => "0px",
			),
			"yAxis" => [
				"type" => "category",
				"data" => $categories,
				"axisTick" => [
					"alignWithLabel" => True,
					"inside" => True
				]
			],
			"xAxis" => [
				"type" => "value",
			],
			"series" => [[
            	'color' => $this->pallete, 
				"data" => $values,
				"type" => "bar"
			]]
		];
    }

    public function generateBarCharts($legend, $categories, $type, $series)
    {
        $legend = $legend->map(function($l) {
            return $this->titler($l);
        });
        $categories = $categories->map(function($l) {
            return $this->titler($l);
        });
        $series = $series->map(function($l) {
            $l['name'] = $this->titler($l['name']);
            return $l;
        });
        $textStyle = array(
            'fontFamily' => 'sans-serif',
            'fontWeight' => 200
        );
        $legendStyle = array(
            'fontFamily' => 'sans-serif',
            'fontWeight' => 200,
            'fontSize' => 14,
        );
        $labels = array(
            'normal' => array (
                'show' => true,
                'position' => 'inside',
            )
        );
        $series = collect($series)->map(function($data) use ($labels) {
            $data['label'] = $labels;
            $data['type'] = 'bar';
			return $data;
        });
        $yAxis = array(
            'type' => 'value',
            'axisLabel' => $textStyle 
        );
        $xAxis = array(
            'type' => 'category',
            'data' => $categories,
            'axisLabel' => $textStyle,
            'axisTick' => array( 'show' => false)
        );
        if ($type === 'Horizontal') {
            $yAxis = array(
                'type' => 'category',
                'data' => $categories,
                'axisLabel' => $textStyle,
                'axisTick' => array( 'show' => false)
            );
            $xAxis = array(
                'type' => 'value',
                'axisLabel' => $textStyle 
            );
        }
        return [
            'color' => $this->pallete, 
            'dataZoom' => array(
                'type' => 'inside',
                'yAxisIndex' => [0]
            ),
			'tooltip' => array (
				'trigger' => 'axis',
				'axisPointer' => array ('type' => 'shadow'),
			),
			'grid' => array(
				'left' => '3%',
				'bottom' => '30.5%',
				'right' => '4%',
				'top' => '3%',
				'containLabel' => true
			),
            'legend' => $this->generateLegend($legend, $legendStyle, 'horizontal', 'left', 'bottom'),
            'toolbox' => array(
                'show' => true,
                'feature' => array( 
                    'saveAsImage' => array( 'show' =>  true, 'title' => 'Save')
                ),
                'bottom' => 0, 
                'right' => 0, 
            ),
            'series' => $series,
            'xAxis' => $xAxis,
            'yAxis' => $yAxis
        ];
    }
    public function generateMapCharts($data, $min, $max){
        $data = collect($data)->map(function($dt){
            $dt = collect($dt);
            $dt['emphasis'] = array(
                'label' => array(
                    'show' => true,
                    'fontSize' => 14,
                	'fontWeight' => 400,
					'color' => '#fff'
                ),
            );
            $dt['label'] = array(
                'show' => true,
                'fontSize' => 12,
				'color' => '#fff'
            );
			$dt['itemStyle'] = array(
				'emphasis' => array(
                    'shadowOffsetX' =>  0,
                    'shadowOffsetY' => 0,
                    'shadowBlur' => 50,
                    'borderWidth' => 2,
                    'borderColor' => '#FFF',
                    'shadowColor' => 'rgba(0, 0, 0, .7)',
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
    private function titler($name) {
        return ucwords(str_replace('_',' ', strtolower($name)));
    }
}
