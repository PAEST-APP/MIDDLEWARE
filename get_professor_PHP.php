<?php
$con = mysqli_connect("paedatabase.c6w0dfqhf1bm.eu-west-3.rds.amazonaws.com", "PAEmasteruser", "0123456789", "PAEdatabase");
$response = array();
if($con){
    $sql = "SELECT * FROM directori WHERE codi_persona = 1563"
    $result = mysqli_query($con, $sql);
}