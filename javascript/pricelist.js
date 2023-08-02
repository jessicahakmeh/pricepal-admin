const records = document.getElementById('records');
const lastList = document.getElementById('lastList');
const uploadButton = document.getElementById('uploadButton');

function updatePriceListStats() {
  fetch('get_pricelist_stats.php')
    .then((response) => response.text())
    .then((data) => {
      records.textContent = data + ' items';
    })
    .catch((error) => {
      console.log('Error fetching pricelist statistics:', error);
    });
}


const collectionRef = db.collection('shop');
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

function updateLastModified(timestamp) {
  collectionRef.doc(shopID).get()
    .then((docSnapshot) => {
      const lastListTimestamp = docSnapshot.get('lastList');
      const formattedTimestamp = formatTimestamp(lastListTimestamp);
      lastList.textContent = formattedTimestamp;
    })
    .catch((error) => {
      console.error('Error retrieving Firestore document:', error);
    });
}



// Initial update when the page loads
updatePriceListStats();
updateLastModified();

uploadButton.addEventListener('click', handleFileSelection);


function handleFileSelection() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx, .csv';
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      console.log("File reading completed");
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension === 'xlsx') {
        const xlsxData = new Uint8Array(reader.result);
        const csvData = convertXlsxToCsv(xlsxData);
        const parsedData = parseCSVData(csvData);
        processCSVData(parsedData);
      } else if (fileExtension === 'csv') {
        const textDecoder = new TextDecoder('utf-8');
        const csvData = textDecoder.decode(reader.result);
        const parsedData = parseCSVData(csvData);
        processCSVData(parsedData);
      } else {
        console.log('Invalid file format. Please select a valid XLSX or CSV file.');
      }
    };

    reader.readAsArrayBuffer(file);
  });

  // Trigger the file chooser dialog
  fileInput.click();
}

function convertXlsxToCsv(xlsxData) {
  const workbook = XLSX.read(xlsxData, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  return csvData;
}

function parseCSVData(csvData) {
  const csvDataString = csvData.toString();
  const lines = csvDataString.split('\n');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    if (values.length === 3 || values.length === 4) {
      const barcode = values[0];
      const item = values[1];
      let price_LBP = values[2] || 0;
      let price_USD = values[3] || 0; 
    
      price_LBP = price_LBP ? parseInt(price_LBP, 10) : 0;
      price_USD = price_USD ? parseFloat(price_USD, 10) : 0;
    
      const row = {
        barcode: barcode,
        item: item,
        price_LBP: price_LBP,
        price_USD: price_USD
      };
    
      data.push(row);
    }
    
    
  } 
  return data;
}

function processCSVData(data) {
  const currentTimestamp = firebase.firestore.Timestamp.now();
  const request = new XMLHttpRequest();
  request.open('POST', 'process_csv_data.php');
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = function() {
    if (request.status === 200) {
      console.log('CSV data processed successfully');
      console.log('Response from server: OK', request.responseText);

  // Update the Firestore document with the last modification timestamp
  collectionRef.doc(shopID).update({ lastList: currentTimestamp })
    .then(() => {
      console.log('Firestore document updated with the last modification timestamp.');
    })
    .catch((error) => {
      console.error('Error updating Firestore document:', error);
    });

      updatePriceListStats(); 
      updateLastModified(); 
    } else {
      console.error('Error adding pricelist data:', request.status);
      console.log('Error response from server:', request.responseText);
    }

  };  
  
  request.send(JSON.stringify({ data: data }));
}

