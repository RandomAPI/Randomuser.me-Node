<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"]   = "0" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 7);
        $contents["cell"]    = "017" . call_user_func($random, 3, 1) . "-" . call_user_func($random, 3, 7);
        // TODO: SSN equivalent for DE
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
