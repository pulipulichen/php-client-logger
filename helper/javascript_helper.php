<?php

class javascript_helper {
    
    static function javascript_header() {
        header('Content-Type: application/javascript; charset=utf-8');
    }
    
    static function json_header() {
        header('Content-Type: application/json; charset=utf-8');
    }
    
    static function jsonp_callback($data) {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');  
        
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        
        if (isset($_GET["callback"])) {
            echo $_GET["callback"] . "(" . $json . ");";
        }
        else {
            echo $json;
        }
    }
    
    static function get_javascript_time() {
        return time() * 1000;
    }
    
    /**
     * @author Pulipuli Chen <pulipuli.chen@gmail.com> 
     * 20160612 修正控制參數的問題
     * @return type
     */
    static function get_http_referer() {
        $referer = $_SERVER["HTTP_REFERER"];
        
        $referer = str_replace("pcl_log_start=true", "", $referer);
        $referer = str_replace("pcl_log_start=false", "", $referer);
        $referer = str_replace("pcl_view_mode=true", "", $referer);
        $referer = str_replace("pcl_view_mode=false", "", $referer);
        
        while (string_helper::ends_with($referer, "?")) {
            $referer = substr($referer, 0, strlen($referer)-1);
        }
        return $referer;
    }
    
    static function get_user_agent() {
        return $_SERVER['HTTP_USER_AGENT'];
    }
    
    static function get_client_ip() {
        
        $env_keys = array(
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR'
        );

        //$profile["client_ip"] = "";
        foreach ($env_keys AS $key) {
            $ip = getenv($key);
            if (isset($ip) && $ip !== 0 && $ip !== "::1" && is_null($ip) === FALSE && $ip !== "" && $ip !== FALSE ) {
                //echo $ip . " / ";
                return $ip;
            }
            //print $ip . " / ";
        }
        return "";
    }
}