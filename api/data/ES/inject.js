<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"] = "9" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 3);
        $contents["cell"]  = "6" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 3);
        $contents["DNI"]   = call_user_func($random, 3, 8) . "-" . call_user_func($random, 4, 1);
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
