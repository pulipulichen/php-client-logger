<?php

class log_set {
    function set($f3) {
        
// 1. 檢查參數
if (isset($_POST) === FALSE 
        || isset($_POST["profile"]) === FALSE 
        || isset($_POST["logs"]) === FALSE) {
    echo "失敗";
    exit;
}

// 2. 接收來自post的參數
$profile = json_decode($_POST["profile"], true);
$logs = json_decode($_POST["logs"], true);

// ----------------------------------------------------------------------
// 3. 先把profile資料湊齊
if (is_array($profile) === FALSE) {
    $profile = [];
}

$profile["client_ip"] = javascript_helper::get_client_ip();
$profile["user_agent"] = javascript_helper::get_user_agent();
$profile["http_referer"] = javascript_helper::get_http_referer();

// 4. 儲存profile資料
$profile_bean = R::findOrCreate("profile", $profile);
$profile_bean_id = R::store($profile_bean);

// ----------------------------------------------------------------------
// 5. 設定log資料

$event_id_mapper = array();

$log_beans = array();
foreach ($logs AS $key => $log) {
    //$logs[$key]["profile_id"] = $profile_bean_id;
    $bean = R::dispense("log");
    $bean->profile_id = $profile_bean_id;
    $bean->timestamp = $log["timestamp"];
    //$bean->event = $log["event"];
    $event = $log["event"];
    if (isset($event_id_mapper[$event]) === FALSE) {
        $event_bean = R::findOrCreate("event", array("name" => $event) );
        $event_bean_id = R::store($event_bean);
        $event_id_mapper[$event] = $event_bean_id;
    }
    else {
        $event_bean_id = $event_id_mapper[$event];
    }
    $bean->event_id = $event_bean_id;
    
    $attr_array = array(
        "x", "y", "xpath", "aoi", "note"
    );
    
    foreach ($attr_array AS $attr) {
        if (isset($log[$attr]) === FALSE) {
            $log[$attr] = NULL;
        }
        $bean->$attr = $log[$attr];
    }
    
    $log_beans[] = $bean;
}

// 6. 儲存log
R::storeAll($log_beans);

// ----------------------------------------------------
// 儲存aoi map
if (isset($_POST["aoi_map"])) {
    //$aoi_map = json_decode($_POST["aoi_map"], true);
    $aoi_map = $_POST["aoi_map"];
    $aoi_map_bean = R::findOrCreate("aoi_map", array(
        "http_referer" => $_SERVER["HTTP_REFERER"],
        "map" => $aoi_map
    ));
    R::store($aoi_map_bean);
}

    }
}