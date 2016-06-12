<?php

class log_get {
    function mouse_move_stay_heatmap($f3) {
        
        database_helper::view_init($f3);
        
        //$referer = javascript_helper::get_http_referer();
        
        // 測試用
        if ($referer === null) {
            $referer = "http://localhost/php-client-logger/demo/";
        }
        //echo $referer;
        
        // -----------------------------------------------------
        // 基本查詢資料
        
        $where_sql = "http_referer = :http_referer AND name = :name";
        $parameters = array(
            ":http_referer" => $referer,
            ":name" => "mouse_event.move_stay"
        );
        
        // --------------------------------------------------------
        //$_POST["uuid"] = "aaa,bbb";
        if (isset($_POST["uuid"])) {
            $uuid = explode(",", $_POST["uuid"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("uuid", $uuid, $parameters);
        }
        
        if (isset($_POST["profile_name"])) {
            $profile_name = explode(",", $_POST["profile_name"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("profile_name", $profile_name, $parameters);
        }

        //$_POST["max_timestamp"] = "1465700294827";
        if (isset($_POST["max_timestamp"])) {
            $max_timestamp = string_helper::bigintval($_POST["max_timestamp"]);
            $where_sql .= " AND timestamp < :max_timestamp";
            $parameters[":max_timestamp"] = $max_timestamp;
        }
        
        if (isset($_POST["min_timestamp"])) {
            $min_timestamp = string_helper::bigintval($_POST["min_timestamp"]);
            $where_sql .= " AND timestamp > :min_timestamp";
            $parameters[":min_timestamp"] = $min_timestamp;
        }
        
        
        // --------------------------------------------------------
        // 開始查詢
        
        $beans = R::getAll("SELECT x, y FROM log_full WHERE " . $where_sql,  $parameters);
        
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

