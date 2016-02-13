<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $dob = $contents["dob"];

        $contents["phone"] = "0" . mt_rand(1, 5) . "-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2);
        $contents["cell"]  = "06-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2);

        $day   = date("d", $dob);
        $month = date("m", $dob);
        $year  = date("y", $dob);

        $contents["INSEE"] = ($contents["gender"] == "male" ? "1" : "2") . $year . $month . call_user_func($random, 3, 8) . " " . call_user_func($random, 3, 1) . mt_rand(0, 7);
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
