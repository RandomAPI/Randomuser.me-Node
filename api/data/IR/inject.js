<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"]   = "0" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 8);
        $contents["cell"]    = "09" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        //TODO: Add IR SSN equivalent
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
