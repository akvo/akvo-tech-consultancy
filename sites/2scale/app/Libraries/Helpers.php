<?php
namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;

class Helpers
{
    public static function downloadCSV($filename, $data) {
        $headers = array(
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=" . $filename,
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        );
        
        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $data['names']);
            foreach ($data['rows'] as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
