<?php
    exec ("../pdf -type f -exec chmod 0777 {} +");
    exec ("../pdf -type d -exec chmod 0777 {} +");
    if ( $_FILES['file']['error'] > 0 ){
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
        echo "Before for \n ss";

        // for($i=0; $i<count($_FILES['file']['name']); $i++){
            echo $_FILES['file']['name'];
            $destination_path = getcwd().DIRECTORY_SEPARATOR;
            $target_path = '../pdf/' . basename( $_FILES["file"]["name"]);
            @move_uploaded_file($_FILES['file']['tmp_name'], $target_path);
            echo "File Uploaded Successfully";
        // }
        // if(move_uploaded_file($_FILES['file']['tmp_name'], 'upload/' . $_FILES['file']['name']))
        // {
        // }
    }

    /*if ( $_FILES['file']['error'] > 0 ){
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';

        for($i=0; $i<count($_FILES['file']['name']); $i++){
            echo "FILES PHP with i : " + $_FILES['file']['name'][$i] + "\n";
            // $target_path = "../pdf/";
            // $ext = explode('.', basename( $_FILES['file']['name'][$i]));
            // $target_path = $target_path . md5(uniqid()) . "." . $ext[count($ext)-1];

            $destination_path = getcwd().DIRECTORY_SEPARATOR;
            $target_path = '../pdf/' . basename( $_FILES["file"]["name"][$i]);

            if(move_uploaded_file($_FILES['file']['tmp_name'][$i], $target_path)) {
                echo "The file has been uploaded successfully <br />";
            } else{
                echo "There was an error uploading the file, please try again! <br />";
            }
        }
    }*/
?>