// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyChfZYK2MrTpzEv4oKYAzC2BB03H_WCoxQ",
    authDomain: "clone-23527.firebaseapp.com",
    databaseURL: "https://clone-23527.firebaseio.com",
    projectId: "clone-23527",
    storageBucket: "clone-23527.appspot.com",
    messagingSenderId: "526203467591",
    appId: "1:526203467591:web:32b94680323efbb352fe62",
    measurementId: "G-365XY58EVD"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  // data base init
  const database = firebaseApp.firestore();
  // auth init
  const auth = firebase.auth();

  export {database, auth};