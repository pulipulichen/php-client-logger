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
        if (isset($_POST["uuid"])) {
            $uuid = explode(",", $_POST["uuid"]);
            $where_sql .= " AND " . database_helper::in_clauses_builder("uuid", $uuid, $parameters);
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

