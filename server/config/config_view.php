<?php

$view = [];
$view[] = "CREATE VIEW log_full AS 
SELECT profile.uuid, profile.profile_name, profile.client_ip, profile.user_agent, profile.http_referer, event.event_name, 
log.timestamp, log.x, log.y, log.xpath, log.aoi, log.note 
FROM log JOIN profile ON (log.profile_id = profile.id) JOIN event ON (log.event_id = event.id) 
ORDER BY timestamp ASC";

$f3->set("database_view", $view);