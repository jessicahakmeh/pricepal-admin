<?php
// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the username and password from the form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Query the MySQL database to retrieve the admin credentials
    $query = "SELECT * FROM admin WHERE username = ? LIMIT 1";
    $statement = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($statement, 's', $username);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);

    if (mysqli_num_rows($result) > 0) {
        $admin = mysqli_fetch_assoc($result);
        $adminPassword = $admin['password'];

        // Compare the entered password with the stored password
        if ($password === $adminPassword) {
            // Login successful
            // Redirect to the admin dashboard
            header('Location: ./console.html');
            exit();
        } else {
            $errorMessage = 'Incorrect password';
        }
    } else {
        $errorMessage = 'Admin not found';
    }
}
?>