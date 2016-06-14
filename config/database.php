<?php

$CONFIG = [];
$CONFIG["database"] = [];
$CONFIG["database"]["host"] = "localhost";
$CONFIG["database"]["dbname"] = "phpclientlogger";
$CONFIG["database"]["username"] = "phpclientlogger";
$CONFIG["database"]["password"] = "phpclientlogger";
$CONFIG["database"]["view"] = [];
$CONFIG["database"]["view"][] = "CREATE VIEW log_full AS 
SELECT profile.uuid, profile.profile_name, profile.client_ip, profile.user_agent, profile.http_referer, event.event_name, 
log.timestamp, log.x, log.y, log.xpath, log.aoi, log.note 
FROM log JOIN profile ON (log.profile_id = profile.id) JOIN event ON (log.event_id = event.id) 
ORDER BY timestamp ASC";

$f3->mset($CONFIG);