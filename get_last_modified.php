<?php
require 'db.php';

try {

    if (!$conn) {
        throw new Exception("Failed to connect to the database.");
    }

    $query = "SELECT UPDATE_TIME
              FROM information_schema.tables
              WHERE TABLE_SCHEMA = 'pricepal' AND TABLE_NAME = 'pricelist'";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $lastModifiedTimestamp = $row['UPDATE_TIME'];

        if ($lastModifiedTimestamp) {
            $formattedTimestamp = date("F j, Y \a\\t g:i:s A T", strtotime($lastModifiedTimestamp));

            echo  $formattedTimestamp;
        } else {
            echo "Cannot access date time of last pricelist.";
        }
    } else {
        echo "No records found in the 'pricelist' table.";
    }

    mysqli_close($conn);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
