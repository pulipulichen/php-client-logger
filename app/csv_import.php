<?php

class csv_import {
    function form($f3) {
        ?>
<form action="upload" method="post" enctype="multipart/form-data">
    Select CSV file to upload:
    <input type="file" name="csv" id="fileToUpload">
    <br />
    <input type="submit" value="UPLOAD CSV" name="submit">
</form>
        <?php
    }
    
    function upload($f3) {
        $csv = file_get_contents($_FILES['csv']['tmp_name']);
        $file_name = substr($_FILES['csv']['name'], 0, strrpos($_FILES['csv']['name'], ".csv"));
        $file_name = str_replace("_", "", $file_name);
        //echo $file_name;
        
        $lines = explode("\n", $csv);
        $fields_name = NULL;
        $data_set = [];
        
        foreach ($lines AS $line) {
            $line = trim($line);
            if ($line === "") {
                continue;
            }
            $fields = explode(",", $line);
            
            foreach ($fields AS $key => $field) {
                if (substr($field, 0, 1) === '"') {
                    $fields[$key] = substr($field, 1, -1);
                }
                else {
                    $fields[$key] = string_helper::bigintval($field);
                }
            }
            
            if ($fields_name === NULL) {
                $fields_name = $fields;
            }
            else {
                $data_set[] = $fields;
            }
        }
        //var_dump($fields_name);
        //var_dump($data);
        if (count($data_set) === 0) {
            return;
        }
        
        // ------------------------------------------
        // 開始RedBeanPhp
        
        $beans = [];
        //echo $file_name;
        foreach ($data_set AS $data) {
            $bean = R::dispense($file_name);
            foreach ($fields_name AS $key => $field_name) {
                $bean->$field_name = $data[$key];
            }
            $beans[] = $bean;
        }
        if (count($beans) > 0) {
            R::storeAll($beans);
        }
    }
}
        