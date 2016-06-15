<?php


$f3->redirect('GET|HEAD /', '/demo');


$f3->route("GET /f3/about","f3_about->about");
$f3->route("GET /f3/userref","f3_about->userref");
$f3->route("POST /log/set","log_set->set");
$f3->route("GET|POST /log/get/mouse/move/heatmap/live","log_get->mouse_move_heatmap_live");
$f3->route("GET|POST /log/get/mouse/move_stay/heatmap","log_get->mouse_move_stay_heatmap");
$f3->route("GET /pcl.js","pcl_client->script");
