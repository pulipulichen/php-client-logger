<?php

$CONFIG = [];

$CONFIG["globlas"] = [];
$CONFIG["globlas"]["DEBUG"] = 3;
$CONFIG["globlas"]["UI"] = "f3_ui/";

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

$CONFIG["routes"] = [];
$CONFIG["routes"]["GET /f3/about"] = "f3_about->about";
$CONFIG["routes"]["GET /f3/userref"] = "f3_about->userref";
$CONFIG["routes"]["GET POST /log/set"] = "log_set->set";
$CONFIG["routes"]["GET GET|POST /log/get/mouse/move_stay/heatmap"] = "log_get->mouse_move_stay_heatmap";
$CONFIG["routes"]["GET /pcl.js"] = "pcl_client->script";

$f3->mset($CONFIG);

$f3->redirect('GET|HEAD /', '/demo');