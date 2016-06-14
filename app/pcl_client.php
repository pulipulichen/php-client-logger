<?php
class pcl_client {
    function script() {
        javascript_helper::javascript_header();
        
        $script = "";
        //echo file_get_contents("../client/pcl.js");
        $files = scandir("client");
        foreach ($files AS $file) {
            if (string_helper::ends_with($file, ".js")) {
                $script .= file_get_contents("client/" . $file);
            }
        }
        echo $script;
    }
    
}
