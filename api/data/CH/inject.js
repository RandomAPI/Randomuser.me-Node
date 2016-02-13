<?php
class Inject {
    public static function execute(&$contents, $random) {
        $pic = $contents["picture"];
        unset($contents["picture"]);

        $femaleTitles = array("mademoiselle", "madame");
        $contents["name"]["title"]   = $contents["gender"] === "male" ? "monsieur" : $femaleTitles[mt_rand(0, 1)];
        
        $contents["location"]["zip"] = mt_rand(1000, 9999);
        $contents["phone"]           = "(" . call_user_func($random, 3, 3) . ")-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        $contents["cell"]            = "(" . call_user_func($random, 3, 3) . ")-" . call_user_func($random, 3, 3) . "-" . call_user_func($random, 3, 4);
        $contents["AVS"]             = "756." . call_user_func($random, 4, 4) . "." . call_user_func($random, 4, 4) . "." . call_user_func($random, 3, 2);
        $contents["picture"]         = $pic;
    }
}

$inject = new Inject;
?>
