<?php
class string_helper {
    static function ends_with($haystack, $needle) {
        // search forward starting from end minus needle length characters
        return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
    }
    
    static function bigintval($value) {
        $value = trim($value);
        if (ctype_digit($value)) {
          return $value;
        }
        $value = preg_replace("/[^0-9](.*)$/", '', $value);
        if (ctype_digit($value)) {
          return $value;
        }
        return 0;
    }
}