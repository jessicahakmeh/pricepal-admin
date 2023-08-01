<?php
require "db.php";
$sql = "SELECT COUNT(*) AS num_records FROM pricelist";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
$numberOfRecords = $row['num_records'];

// Return the number of records as the response
echo $numberOfRecords;
?>
