function displayPromotions(shopID) {
  const promotionsTableBody = document.getElementById('promotionsTableBody');
  promotionsTableBody.innerHTML = '';

  db.collection('promotion')
    .where('shopID', '==', shopID)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log('No promotions found.');
        return;
      }

      const rows = [];

      querySnapshot.forEach((doc) => {
        const promotionData = doc.data();
        promotionData.id = doc.id;

        const row = document.createElement('tr');

        const promotionCell = document.createElement('td');
        if (promotionData.promoIMG) {
          const img = document.createElement('img');
          const storageRef = storage.ref();
          const imageRef = storageRef.child(promotionData.promoIMG);
          imageRef.getDownloadURL()
            .then((url) => {
              img.src = url;
            })
            .catch((error) => {
              console.log('Error getting image URL:', error);
            });
          img.style.width = '300px';
          img.style.height = 'auto';

          promotionCell.appendChild(document.createTextNode(promotionData.promo));
          promotionCell.appendChild(document.createElement('br'));
          promotionCell.appendChild(img);
        } else {
          promotionCell.textContent = promotionData.promo;
        }

        row.appendChild(promotionCell);

        const expiryDateCell = document.createElement('td');
        if (promotionData.expiry) {
          expiryDateCell.textContent = promotionData.expiry.toDate().toLocaleDateString();
        } else {
          expiryDateCell.textContent = 'N/A';
        }
        row.appendChild(expiryDateCell);

        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () =>
          deletePromotion(promotionData.id, shopID, promotionData.promoIMG)
        );
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        rows.push(row);
      });

      // Append all rows at once to improve performance
      promotionsTableBody.append(...rows);
    })
    .catch((error) => {
      console.log('Error fetching promotions:', error);
    });
}


function deletePromotion(promotionId, shopID, promoIMG) {
  db.collection('promotion')
    .doc(promotionId)
    .delete()
    .then(() => {
      console.log('Promotion deleted successfully');

      if (promoIMG) {
        const imageRef = firebase.storage().ref().child(promoIMG);
        imageRef
          .delete()
          .then(() => {
            console.log('Promotion image deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting promotion image:', error);
          })
          .finally(() => {
            displayPromotions(shopID); // Call displayPromotions after deleting the image (with or without error)
          });
      } else {
        displayPromotions(shopID); // If no promo image, directly call displayPromotions
      }
    })
    .catch((error) => {
      console.error('Error deleting promotion:', error);
    });
}

async function handlePromotionFormSubmit(event, shopID) {
  event.preventDefault();

  const promotionText = document.getElementById('promotionText').value;
  const promotionImage = document.getElementById('promotionImage').files[0];
  const expiryDate = document.getElementById('expiryDate').value;

  if (!promotionText && !promotionImage) {
    alert('At least one of promo or promoIMG must be filled.');
    return;
  }

  if (expiryDate && new Date(expiryDate) < new Date()) {
    alert('Expiry date must be in the future.');
    return;
  }

  const addPromo = document.getElementById('addPromo');
  const originalButtonText = addPromo.textContent;
  addPromo.disabled = true;
  addPromo.textContent = 'Uploading...';

  try {
    const promotionData = {
      promo: promotionText,
      shopID: shopID,
      expiry: expiryDate ? firebase.firestore.Timestamp.fromDate(new Date(expiryDate)) : null,
    };

    if (promotionImage) {
      const storageRef = firebase.storage().ref(shopID);
      const promotionRef = db.collection('promotion').doc();
      const promotionID = promotionRef.id; 
      const imageName = promotionID + '-' + promotionImage.name;

      await storageRef.child(imageName).put(promotionImage);
      promotionData.promoIMG = `${shopID}/${imageName}`;
      
      // Save the promotion data with the correct document ID to Firestore
      await promotionRef.set(promotionData);
    } else {
      // If no promo image, directly save the promotion data to Firestore
      await db.collection('promotion').add(promotionData);
    }

    console.log('Promotion added successfully');
    promotionForm.reset();

    // Initialize the promotionsTableBody element if it has not been initialized yet
    const promotionsTableBody = document.getElementById('promotionsTableBody');
    if (!promotionsTableBody) {
      promotionsTableBody = document.createElement('tbody');
      document.getElementById('promotionsTable').appendChild(promotionsTableBody);
    }

    displayPromotions(shopID);
  } catch (error) {
    alert('Error adding promotion:', error);
  } finally {
    addPromo.disabled = false;
    addPromo.textContent = originalButtonText;
  }
}

// Call the function initially to display promotions
document.addEventListener('DOMContentLoaded', displayPromotions(shopID));