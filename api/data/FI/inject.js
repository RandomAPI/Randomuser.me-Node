<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $dob = $contents["dob"];
        $full_year = date("Y", $dob);

        $contents["phone"] = "0" . mt_rand(2, 9) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 3);
        $contents["cell"]  = "04" . mt_rand(0, 9) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 2);

        $day   = date("d", $dob);
        $month = date("m", $dob);
        $year  = date("y", $dob);

        if ($full_year < 1900) {
            $century = "+";
        } else if ($year >= 1900 && $year < 2000) {
            $century = "-";
        } else {
            $century = "A";
        }

        $zzz = call_user_func($random, 3, 2) .  ($contents["gender"] != "male" ? array(0, 2, 4, 6, 8)[mt_rand(0, 4)] : array(1, 3, 5, 7, 9)[mt_rand(0, 4)]);

        $checksum_str = "0123456789ABCDEFHJKLMNPRSTUVWXY";
        $cc = $checksum_str[($day . $month . $year . $zzz) % 31];

        $hetu = $day . $month . $year . $century . $zzz . $cc;

        $contents["HETU"]    = $hetu;
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
