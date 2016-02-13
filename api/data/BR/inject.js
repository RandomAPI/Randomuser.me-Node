<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"]   = "(" . call_user_func($random, 3, 2) . ") " . call_user_func($random, 3, 4) . "-" . call_user_func($random, 3, 4);
        $contents["cell"]    = "(" . call_user_func($random, 3, 2) . ") " . call_user_func($random, 3, 4) . "-" . call_user_func($random, 3, 4);
        // TODO: Add version of SSN
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
