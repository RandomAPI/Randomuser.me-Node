<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $contents["phone"] = "0" . mt_rand(0, 9) . "-" . mt_rand(0, 9) . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        $contents["cell"]  = "04" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 3);
        $contents["TFN"]   = call_user_func($random, 3, 9);
        $contents["picture"] = $pic;
        $contents["location"]["zip"] = mt_rand(200, 9999); // Override common zip with AU range

        // Override common zip with AU range
        $oldStreet = $contents["location"]["street"];
        $contents["location"]["street"] = preg_replace("/(\d*) (.*)/", mt_rand(1,9999) ." $2", $oldStreet);
    }
}

$inject = new Inject;
?>
