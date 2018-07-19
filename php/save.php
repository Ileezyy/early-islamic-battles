<?php
    $data = $_POST['jsonString'];
    //set mode of file to writable.
    chmod("../data/all_battles_new.json", 0777);
    $f = fopen("../data/all_battles_new.json", "w+") or die("fopen failed");
    fwrite($f, $data);
    fclose($f);
?>