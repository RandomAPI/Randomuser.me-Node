<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"] = "0" . mt_rand(1, 7) . "1-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        $contents["cell"]  = "081-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        $contents["PPS"]   = call_user_func($random, 3, 7) . "T" . ($contents["dob"] >= 1356998400 ? "A" : "");
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
