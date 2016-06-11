<?php

include_once 'config.php';
include_once 'lib/redbeanphp/rb.config.php';

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

$env_keys = array(
    'HTTP_CLIENT_IP',
    'HTTP_X_FORWARDED_FOR',
    'HTTP_X_FORWARDED',
    'HTTP_FORWARDED_FOR',
    'HTTP_FORWARDED',
    'REMOTE_ADDR'
);

$profile["client_ip"] = "";
foreach ($env_keys AS $key) {
    $ip = getenv($key);
    if (isset($ip) && $ip !== 0 && $ip !== "::1" && is_null($ip) === FALSE && $ip !== "" && $ip !== FALSE ) {
        //echo $ip . " / ";
        $profile["client_ip"] = $ip;
        break;
    }
    //print $ip . " / ";
}

$profile["user_agent"] = $_SERVER['HTTP_USER_AGENT'];
$profile["http_referer"] = $_SERVER["HTTP_REFERER"];

// 4. 儲存profile資料
$profile_bean = R::findOrCreate("profile", $profile);
$profile_bean_id = R::store($profile_bean);

exit;

// ----------------------------------------------------------------------
// 5. 設定log資料

$log_beans = array();
foreach ($logs AS $key => $log) {
    //$logs[$key]["profile_id"] = $profile_bean_id;
    $bean = R::dispense("log");
    $bean->profile_id = $profile_bean_id;
    $bean->event_name = $log["event_name"];
    
    if (isset($log["x"]) === FALSE) {
        $log["x"] = NULL;
    }
    $bean->x = $log["x"];
    
    if (isset($log["y"]) === FALSE) {
        $log["y"] = NULL;
    }
    $bean->y = $log["y"];
    
    if (isset($log["note"]) === FALSE) {
        $log["note"] = NULL;
    }
    $bean->note = $log["note"];
    
    $log_beans[] = $bean;
}

// 6. 儲存log
R::storeAll($log_beans);