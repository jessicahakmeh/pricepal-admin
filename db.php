<?php

$host = '127.0.0.1:3306';
$dbname = 'pricepal';
$username = 'user';
$password = 'password';

$conn=mysqli_connect($host,$username,$password,$dbname);
if(!$conn){
    die("Connection failed". mysqli_connect_error());
}

?>