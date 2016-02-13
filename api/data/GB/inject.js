<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $phones = array(
          "01" . call_user_func($random, 3, 3) . " " . call_user_func($random, 3, 5),
          "01" . call_user_func($random, 3, 3) . " " . call_user_func($random, 3, 6),
          "011" . call_user_func($random, 3, 1) . call_user_func($random, 3, 3) . " " . call_user_func($random, 3, 3) . " " .  call_user_func($random, 3, 4),
          "01" . call_user_func($random, 3, 1) . "1 " . call_user_func($random, 3, 3) . " " . call_user_func($random, 3, 4),
          "013873" . " " . call_user_func($random, 3, 5),
          "015242" . " " . call_user_func($random, 3, 5),
          "015394" . " " . call_user_func($random, 3, 5),
          "015395" . " " . call_user_func($random, 3, 5),
          "015396" . " " . call_user_func($random, 3, 5),
          "016973" . " " . call_user_func($random, 3, 5),
          "016974" . " " . call_user_func($random, 3, 5),
          "016977" . " " . call_user_func($random, 3, 4),
          "016977" . " " . call_user_func($random, 3, 5),
          "017683" . " " . call_user_func($random, 3, 5),
          "017684" . " " . call_user_func($random, 3, 5),
          "017687" . " " . call_user_func($random, 3, 5),
          "019467" . " " . call_user_func($random, 3, 5),
          "02" . call_user_func($random, 3, 1) . " " . call_user_func($random, 3, 4) . " " . call_user_func($random, 3, 4)
        );

        $code = "ABDEFGHJLNPQRSTUWXYZ";

        $zips = array(
          call_user_func($random, 4, 1) . call_user_func($random, 3, 1) . " " . call_user_func($random, 3, 1) . $code[mt_rand(0, 19)] . $code[mt_rand(0, 19)],
          call_user_func($random, 4, 2) . call_user_func($random, 3, 1) . " " . call_user_func($random, 3, 1) . $code[mt_rand(0, 19)] . $code[mt_rand(0, 19)],
          call_user_func($random, 4, 1) . call_user_func($random, 3, 2) . " " . call_user_func($random, 3, 1) . $code[mt_rand(0, 19)] . $code[mt_rand(0, 19)],
          call_user_func($random, 4, 2) . call_user_func($random, 3, 2) . " " . call_user_func($random, 3, 1) . $code[mt_rand(0, 19)] . $code[mt_rand(0, 19)],
          call_user_func($random, 4, 2) . call_user_func($random, 3, 1) . call_user_func($random, 4, 1) . " " . call_user_func($random, 3, 1) . $code[mt_rand(0, 19)] . $code[mt_rand(0, 19)],
          call_user_func($random, 4, 1) . call_user_func($random, 3, 1) . call_user_func($random, 4, 1) . " " . call_user_func($random, 3, 1) . $code[mt_rand(0, 19)] . $code[mt_rand(0, 19)]
        );

        $contents["location"]["zip"] = $zips[mt_rand(0, 5)];

        $contents["phone"]   = $phones[mt_rand(0, 17)];
        $contents["cell"]    = "07" . call_user_func($random, 3, 2) . "-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 3);


        $nino_1 = "abceghjklmnoprstwxyz";
        $nino_2 = "abceghjklmnprstwxyz";

        $nino = strtoupper($nino_1[mt_rand(0, 19)] . $nino_2[mt_rand(0, 18)] . " " . call_user_func($random, 3, 2) . " " .  call_user_func($random, 3, 2) . " " . call_user_func($random, 3, 2) . " " . call_user_func($random, 4, 1));

        $contents["NINO"]    = $nino;
        $contents["picture"] = $pic;
    }
}

$inject = new Inject;
?>
