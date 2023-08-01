// Initialize Firebase app
const firebaseConfig = {
    apiKey: "AIzaSyCqNGgJDgYK8od2ECBu2PGwqCA8WiV1Kgw",
    authDomain: "pricepal-d9708.firebaseapp.com",
    projectId: "pricepal-d9708",
    storageBucket: "pricepal-d9708.appspot.com",
    messagingSenderId: "1066683216545",
    appId: "1:1066683216545:web:39480b0bb5e513afedb6e0",
    measurementId: "G-Q2SJH7WJ6F"
  };
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const storage = firebase.storage();