<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="../images/logo.png">
    <title>PricePal - Admin</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.9.1/firebase-firestore.js"></script>
    <script src="firebase-config.js"></script>

</head>
<body style="background-color: #0077b6;">
    <main>
    <form>
        <fieldset>
            <legend>Login</legend>
            <div>
                <label>Username:</label>
                <input type="text" name="username" id="username" />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" id="password" />
            </div>
            <br>
            <button id="login">Log in</button>
        </fieldset>
    </form>
    </main>
    <script src="javascript/login.js"></script>
</body>
</html>

