import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD7egn55TYeUXQakvnaptQSvECX2I7BNjQ",
    authDomain: "bim-dev-master-a9320.firebaseapp.com",
    projectId: "bim-dev-master-a9320",
    storageBucket: "bim-dev-master-a9320.appspot.com",
    messagingSenderId: "209234520823",
    appId: "1:209234520823:web:6779842fdb23cf7b9cc1f2"
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore();