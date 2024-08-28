import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Add this line
import "firebase/compat/auth"; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyAo0IGnwSjk0-u7Yx7WRSEJY9VpduhmJaw",
  authDomain: "netflix-clone-a76c7.firebaseapp.com",
  projectId: "netflix-clone-a76c7",
  storageBucket: "netflix-clone-a76c7.appspot.com",
  messagingSenderId: "1005314439652",
  appId: "1:1005314439652:web:9c9b7d8f852d2144a96ff1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export {auth};

export default db;