<?php

class log_get {
    function mouse_move_stay_heatmap() {
        $referer = javascript_helper::get_http_referer();
        if ($referer === null) {
            $referer = "http://localhost/php-client-logger/demo/";
        }
        echo $referer;
        
        $beans = R::getAll('SELECT x, y FROM log JOIN profile ON (log.profile_id = profile.id) JOIN event_id ON (log.event_id = event.id)'
                . 'WHERE profile.http_referer = :referer AND event.name = :event_name',
            [
                ":referer" => $referer,
                ":event_name" => "mouse_event.move_stay"
                ]
        );
        
        foreach ($beans AS $bean) {
            echo $bean["x"] . "-" . $bean["y"] . "<br />\n";
        }
        echo 1212;
    }
}

