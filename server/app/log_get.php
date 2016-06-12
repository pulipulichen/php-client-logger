<?php

class log_get {
    function mouse_move_stay_heatmap() {
        $referer = javascript_helper::get_http_referer();
        if ($referer === null) {
            $referer = "http://localhost/php-client-logger/demo/";
        }
        //echo $referer;
        
        $beans = R::getAll('SELECT x, y FROM log JOIN profile ON (log.profile_id = profile.id) JOIN event ON (log.event_id = event.id) '
                . 'WHERE profile.http_referer = :referer AND event.name = :event_name '
                . 'ORDER BY timestamp ASC',
            [
                ":referer" => $referer,
                ":event_name" => "mouse_event.move_stay"
                ]
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

