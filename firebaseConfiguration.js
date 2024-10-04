// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const GetApp = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyB7yTETnf8FhM-uPDQbexz28vToNV4FE7M",
    authDomain: "ordin-87757.firebaseapp.com",
    projectId: "ordin-87757",
    storageBucket: "ordin-87757.appspot.com",
    messagingSenderId: "395616894247",
    appId: "1:395616894247:web:cebc308f92bfde83ddbd02",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return app;
};

export default GetApp;
