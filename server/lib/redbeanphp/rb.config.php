<?php

include_once 'rb.php';

// 連接方式說明
// http://www.redbeanphp.com/index.php?p=/connection
R::setup('pgsql:host=' . $CONFIG["db_host"] . ';dbname=' . $CONFIG["db_name"], $CONFIG["db_user"], $CONFIG["db_password"]);
R::setAutoResolve(TRUE);        //Recommended as of version 4.2