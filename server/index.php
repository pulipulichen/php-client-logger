<?php

// Kickstart the framework
$f3=require('lib/base.php');

$f3->set('DEBUG',1);
if ((float)PCRE_VERSION<7.9) {
	trigger_error('PCRE version is out of date');
}

// Load configuration
$f3->config('config.ini');

// ---------------------------------------
// 資料庫：RedBeanPHP使用
include_once 'lib/redbeanphp/rb.php';

// RedBeanPHP連接方式說明 http://www.redbeanphp.com/index.php?p=/connection
R::setup('pgsql:host=' . $f3->get('database')["host"] . ';dbname=' . $f3->get('database')["dbname"], $f3->get('database')["username"], $f3->get('database')["password"]);
R::setAutoResolve(TRUE);        //Recommended as of version 4.2

$f3->db=new \DB\SQL('pgsql:host=' . $f3->get('database')["host"] . ';dbname=' . $f3->get('database')["dbname"], $f3->get('database')["username"], $f3->get('database')["password"]);

// ---------------------------------------
$f3->set('AUTOLOAD','app/; helper/');

$f3->run();
