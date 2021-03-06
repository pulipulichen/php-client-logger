<?php
class database_helper {

    static function view_init($f3) {
        $config = R::findOne('config', 'key = ?', ['view_init']);
        if (isset($config) === FALSE || true) {
            //echo 1212;
            $views = $f3->get("database")["view"];
            //print_r($views);
            if (is_array($views)) {
                foreach ($views AS $view) {
                    //echo $view;
                    try {
                        R::exec($view);
                    }
                    catch (Exception $e) {
                        //throw $e;
                    }
                }
                $config = R::dispense('config');
                $config->key = "view_init";
                $config->value = true;
                R::store($config);
            }
        }
    }
    
    static function in_clauses_builder($field, $conditions, &$parameters) {
        $clauses = [];
        foreach ($conditions AS $key => $c) {
            $p_key = ":" . $field . $key;
            $clauses[] = $field . " = " . $p_key;
            $parameters[$p_key] = $c;
        }
        $output = "(" . implode(" OR ", $clauses) . ")";
        //$clauses = "(" . implode(", ", $conditions) . ")";
        return $output;
    }
    
    static function with_post_condition($field, &$where, &$parameters, $type = "string") {
        if (isset($_POST[$field])) {
            $key = ":" . $field;
            while (isset($parameters[$key])) {
                $key .= "_";
            }
            
            $where .= " AND " . $field . " = " . $key;
            
            $value = $_POST[$field];
            if ($type === "boolean") {
                if ($value === "true") {
                    $value = TRUE;
                }
                else {
                    $value = FALSE;
                }
            }
            else if ($type === "number") {
                $value = string_helper::bigintval($value);
            }
            
            $parameters[$key] = $value;
        }
    }
}