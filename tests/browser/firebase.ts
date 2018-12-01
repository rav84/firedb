import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

/**
 * Preparation for testing.
 * 1. Have a firebase project ready for testing. Preferrably a blank.
 * 2. Enable email/password login method and create a test user.
 * 3. Make sure firestore is enabled and user has read write access.
 * 4. Copy the firebase project config.
 */

////////////////////////////////////////////////////////
/* UPDATE THE CONFIG BELOW BEFORE RUNNING TESTS */
const config = {
  apiKey: "AIzaSyBh4rBHKNn7D0DrCKlzGXuBd4uSl5dwvDA",
  authDomain: "cutefire-5e5be.firebaseapp.com",
  databaseURL: "https://cutefire-5e5be.firebaseio.com",
  projectId: "cutefire-5e5be",
  storageBucket: "cutefire-5e5be.appspot.com",
  messagingSenderId: "59997526440"
};
////////////////////////////////////////////////////////
const user = ["test@arohanyas.com", "welcome"];
////////////////////////////////////////////////////////
const fire = firebase.initializeApp(config, "testapp");
console.info("Firebase initialised");
export default fire;