<?php

if (!function_exists('error_logging')) {
    function error_logging($x){
        ob_start();
        var_dump($x);
        $contents = ob_get_contents();
        ob_end_clean();
        error_log($contents);
    }
}

?>
