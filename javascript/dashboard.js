  // Get the shop_ID from the query parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const shopID = urlParams.get('shopID');
  const shopRef = db.collection('shop').doc(shopID);

  if (!shopID) {
      window.location.href ="../index.php"
  } 
  function displayExchangeRate() {
    shopRef
      .onSnapshot((doc) => {
        const shopData = doc.data();
        const exchangeRate = shopData.rate;
        const lastRateChange = shopData.lastRate;
  
        document.getElementById('rate').innerText = exchangeRate;
        const lastRateDate = formatTimestamp(lastRateChange);
        document.getElementById('lastRate').innerText = lastRateDate;
      }, (error) => {
        alert('Error retrieving exchange rate:', error);
      });
  }
  
  function formatTimestamp(timestamp) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat('en', options).format(timestamp.toDate());
  }

// Function to display shop information
function displayShopInfo() {
  shopRef
    .get()
    .then((doc) => {
      const shopData = doc.data();
      const username = shopData.username;
      document.getElementById('user').textContent = username;
    })
    .catch((error) => {
      console.error('Error retrieving shop info:', error);
    });
}

// Call the functions initially
displayExchangeRate();
displayShopInfo();

function handleRateChange() {
  const newRate = prompt('Enter the new rate (LL):');
  if (newRate !== null) {
    if (isNaN(newRate) || newRate === '') {
      alert('Invalid rate! Please enter a valid number.');
      return;
    }
    // Convert the new rate to a number
    const rate = Number(newRate);
    // Update
    shopRef
      .update({
        rate: rate,
        lastRate: firebase.firestore.Timestamp.now() // Set lastRate to the current timestamp using "now()"
      })
      .then(() => {
        console.log('Rate updated successfully');
        displayExchangeRate();
      })
      .catch((error) => {
        alert('Error updating rate:', error);
      });
  }
}

const passphrase = 'DigiDome';
function generateQRCode() {
  const encryptedShopID = encryptShopID(shopID, passphrase);
  const qrCodeData = JSON.stringify({ encryptedShopID }); 
  const qrCodeDataURL = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(qrCodeData); // Generate the QR code URL

  // Create a link element to download the QR code image
  const downloadLink = document.createElement('a');
  downloadLink.href = qrCodeDataURL;
  downloadLink.download = 'qr_code.png';
  downloadLink.click();
}

// Function to encrypt the shopID using the passphrase
function encryptShopID(shopID, passphrase) {
  const encryptedShopID = CryptoJS.AES.encrypt(shopID.toString(), passphrase).toString();
  return encryptedShopID;
}

const generateQRCodeButton = document.getElementById('generateQRcode');
generateQRCodeButton.addEventListener('click', generateQRCode);
