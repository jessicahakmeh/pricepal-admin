// Login button click event
document.getElementById('login').addEventListener('click', function(event) {
  event.preventDefault();

  // Get the username and password input values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Retrieve the admin document from Firestore based on the entered username
  db.collection('shop').where('username', '==', username).limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Admin document found
        const admin = querySnapshot.docs[0];
        const adminData = admin.data();
        const adminPassword = adminData.password;

        // Compare the entered password with the stored password
        if (password === adminPassword) {
          // Login successful, redirect to the admin dashboard with the shopID as a query parameter
          const shopID = admin.id;
          const url = new URL('./console.php', window.location.href);
          url.searchParams.set('shopID', shopID);
          window.location.href = url.href;  
        } else {
          alert('Incorrect password');
        }
      } else {
        alert('Admin not found');
      }
    })
    .catch((error) => {
      // Handle Firestore retrieval error
      alert(error.message);
    });
});
