<?php 
function check_in_array($value, $array, $key){
	foreach($array as $item){
		if($item[$key] == $value)
			return true;
	}
	return false;
}
function generateCSV($file, $data){
	$filelocation = "resources/data/";
	$fp = fopen($filelocation.$file, 'w');

	echo "<br> Generated : ".$filelocation.$file."<br>";
	
	echo $header="tipo, parent, value";
	echo $csv=array_to_csv($data);

	fwrite($fp, $header);
	fwrite($fp, $csv);
	fclose($fp);
}
function array_to_csv($array) {
	$csv = array();
	foreach ($array as $item) {
		if (is_array($item)) {
			$csv[] = array_to_csv($item);
		} else {
			$csv[] = $item;
		}
	}

	$out_text = "\r\n";
	$out_text_body = implode(",", $csv);
	$out_text = $out_text . $out_text_body;
	return $out_text;
}
function in_multiarray($needle, $needle_field, $haystack, $strict = false) {
	if ($strict) {
		foreach ($haystack as $item)
			if (isset($item->$needle_field) && $item->$needle_field === $needle)
				return true;
	}
	else {
		foreach ($haystack as $item)
			if (isset($item->$needle_field) && $item->$needle_field == $needle)
				return true;
	}
	return false;
}
function ucname($string) {
	$string =ucwords(strtolower($string));

	foreach (array('-', '\'') as $delimiter) {
		if (strpos($string, $delimiter)!==false) {
			$string =implode($delimiter, array_map('ucfirst', explode($delimiter, $string)));
		}
	}
	return $string;
}
function curl_get_data($url){
	$curlConfig = array(
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_URL => $url
	);
	
	$ch = curl_init();
	curl_setopt_array($ch, $curlConfig);
	return curl_exec($ch);
}
function array_sort_by_column(&$arr, $col, $dir = SORT_ASC) {
	$sort_col = array();
	foreach ($arr as $key=> $row) {
		$sort_col[$key] = $row[$col];
	}

	array_multisort($sort_col, $dir, $arr);
}
function startsWith($haystack, $needle) {
	$length = strlen($needle);
	return (substr($haystack, 0, $length) === $needle);
}
?>