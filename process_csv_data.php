<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $csvData = $data['data'];

    // Delete existing pricelist entries
    $sql = "DELETE FROM pricelist";
    mysqli_query($conn, $sql);

    // Insert new pricelist entries
    $values = [];
    foreach ($csvData as $row) {
        $barcode = mysqli_real_escape_string($conn, $row['barcode']);
        $item = mysqli_real_escape_string($conn, $row['item']);
        $price_LBP = $row['price_LBP'];
        $price_USD = $row['price_USD'];
        $values[] = "('$barcode', '$item', '$price_LBP', '$price_USD')";
    }
    if (!empty($values)) {
        $sql = "INSERT INTO pricelist (barcode, item, price_LBP, price_USD) VALUES " . implode(',', $values);
        mysqli_query($conn, $sql);
    }

    // Return a success response
    http_response_code(200);
} else {
    http_response_code(400);
    echo "Invalid request method";
}
?>
