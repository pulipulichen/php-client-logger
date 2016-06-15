<?php

class log_get {
    function mouse_move_heatmap_live($f3) {
        
        database_helper::view_init($f3);
        
        $referer = javascript_helper::get_http_referer();
        
        // 測試用
        //$referer = "http://localhost/php-client-logger/demo/";
        //echo $referer;
        
        // -----------------------------------------------------
        // 基本查詢資料
        
        $where_sql = "http_referer = :http_referer AND event_name = :event_name";
        $parameters = array(
            ":http_referer" => $referer,
            //":name" => "mouse_event.move_stay"
            ":event_name" => "mouse_event.move"
        );
        
        // --------------------------------------------------------
        //$_POST["uuid"] = "aaa,bbb";
        if (isset($_GET["uuid"])) {
            $uuid = explode(",", $_GET["uuid"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("uuid", $uuid, $parameters);
        }
        
        if (isset($_GET["profile_name"])) {
            $profile_name = explode(",", $_GET["profile_name"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("profile_name", $profile_name, $parameters);
        }

        //$_POST["max_timestamp"] = "1465700294827";
        if (isset($_GET["max_timestamp"])) {
            $max_timestamp = string_helper::bigintval($_GET["max_timestamp"]);
            $where_sql .= " AND timestamp < :max_timestamp";
            $parameters[":max_timestamp"] = $max_timestamp;
        }
        
        if (isset($_GET["min_timestamp"])) {
            $min_timestamp = string_helper::bigintval($_GET["min_timestamp"]);
            $where_sql .= " AND timestamp > :min_timestamp";
            $parameters[":min_timestamp"] = $min_timestamp;
        }
        
        if (isset($_GET["min_timestamp"]) === FALSE) {
            $_GET["min_timestamp"] = javascript_helper::get_javascript_time() - 30000;
            $min_timestamp = string_helper::bigintval($_GET["min_timestamp"]);
            $where_sql .= " AND timestamp > :min_timestamp";
            $parameters[":min_timestamp"] = $min_timestamp;
        }
        
        
        // --------------------------------------------------------
        // 開始查詢
        
        $beans = R::getAll("SELECT x, y FROM log_full WHERE " . $where_sql,  $parameters);
        
        //echo "SELECT x, y FROM log_full WHERE " . $where_sql;
        //print_r($parameters);
        //echo count($beans);
        
        // ----------------------------
        // 輸出資料
        
        $data = [];
        foreach ($beans AS $bean) {
            //echo $bean["x"] . "-" . $bean["y"] . "<br />\n";
            $data[] = [$bean["x"], $bean["y"]];
        }
        
        javascript_helper::jsonp_callback($data);
        //echo 1212;
    }
    
    function mouse_move_stay_heatmap($f3) {
        
        database_helper::view_init($f3);
        
        $referer = javascript_helper::get_http_referer();
        
        // 測試用
        $referer = "http://exp-pcl-2016.dlll.nccu.edu.tw:20780/php-client-logger/demo/enable_log_view.html";
        //echo $referer;
        
        // -----------------------------------------------------
        // 基本查詢資料
        
        $where_sql = " http_refer = :http_referer AND event_name = :event_name ";
        $parameters = array(
            ":http_referer" => $referer,
            //":name" => "mouse_event.move_stay"
            ":event_name" => "mouse_event.move_stay"
        );
        
        // --------------------------------------------------------
        //$_POST["uuid"] = "aaa,bbb";
        if (isset($_GET["uuid"])) {
            $uuid = explode(",", $_GET["uuid"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("uuid", $uuid, $parameters);
        }
        
        if (isset($_GET["profile_name"])) {
            $profile_name = explode(",", $_GET["profile_name"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("profile_name", $profile_name, $parameters);
        }

        //$_POST["max_timestamp"] = "1465700294827";
        if (isset($_GET["max_timestamp"])) {
            $max_timestamp = string_helper::bigintval($_GET["max_timestamp"]);
            $where_sql .= " AND timestamp < :max_timestamp";
            $parameters[":max_timestamp"] = $max_timestamp;
        }
        
        
        
        // --------------------------------------------------------
        // 開始查詢
        
        $beans = R::getAll("SELECT x, y FROM log_full WHERE " . $where_sql,  $parameters);
        
        //echo "SELECT x, y FROM log_full WHERE " . $where_sql;
        //print_r($parameters);
        //echo count($beans);
        
        // ----------------------------
        // 輸出資料
        
        $data = [];
        foreach ($beans AS $bean) {
            //echo $bean["x"] . "-" . $bean["y"] . "<br />\n";
            $data[] = [$bean["x"], $bean["y"]];
        }
        
        javascript_helper::jsonp_callback($data);
        //echo 1212;
    }
}

