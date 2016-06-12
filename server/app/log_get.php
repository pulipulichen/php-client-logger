<?php

class log_get {
    function mouse_move_stay_heatmap() {
        $referer = javascript_helper::get_http_referer();
        if ($referer === null) {
            $referer = "http://localhost/php-client-logger/demo/";
        }
        //echo $referer;
        
        $select_sql = 'SELECT x, y FROM log JOIN profile ON (log.profile_id = profile.id) JOIN event ON (log.event_id = event.id) ';
        $where_sql = 'WHERE profile.http_referer = :referer AND event.name = :event_name ';
        $order_sql = 'ORDER BY timestamp ASC';
        $parameters = [
            ":referer" => $referer,
            ":event_name" => "mouse_event.move_stay"
        ];
        
        // ---------------------------------
        // 如果有filter的話
        $uuid = array("aCs$-g", "aaa");
        //if (isset($_POST["uuid"])) {
            $where_sql .= " AND profile.uuid IN (:uuid) ";
            //$parameters[":uuid"] = "(" . $_POST["uuid"] . ")";
            $parameters[":uuid"] = $uuid;
        //}
            
        // ---------------------------------
        // 開始查詢
        
        $beans = R::getAll($select_sql . " "
                . $where_sql . " "
                . $order_sql,
            $parameters
        );
        
        $data = [];
        foreach ($beans AS $bean) {
            //echo $bean["x"] . "-" . $bean["y"] . "<br />\n";
            $data[] = [$bean["x"], $bean["y"]];
        }
        
        javascript_helper::jsonp_callback($data);
        //echo 1212;
    }
}

