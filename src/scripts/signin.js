// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { login, createUser, addUSerToDatabase } from "./functions/auth"
// Your web app's Firebase configuration
import firebaseConfig from "../utils/firebase";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
//console.log(app);

const signInForm = document.getElementById("signInForm");

signInForm.addEventListener("submit", async(e) => {

    e.preventDefault();

    console.log("User created");

    const name = signInForm.name.value;
    const lastName = signInForm.lastName.value;
    const email = signInForm.email.value;
    const password = signInForm.password.value;

    const newUser = {
        name,
        lastName,
        email,
        password,
        isAdmin: false
    }

    const userCreated = await createUser(auth, newUser);
    await addUSerToDatabase(db, userCreated.uid, newUser);
    //console.log(userCreated);
    //createUser(auth, newUser);
    alert(`Bienvenido, ${name +" "+ lastName}`);
    window.location.href = "./landing.html";

});