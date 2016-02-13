<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"]   = "(" . call_user_func($random, 3, 3) . ")-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        $contents["cell"]    = "(" . call_user_func($random, 3, 3) . ")-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        // TODO: SSN equivalent for NZ
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
