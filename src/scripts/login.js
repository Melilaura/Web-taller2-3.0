// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {auth} from "./app";
import { initializeApp } from "firebase/app";

import { login, createUser, addUSerToDatabase } from "./functions/auth"
// Your web app's Firebase configuration
import firebaseConfig from "../utils/firebase";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//import { login, createUser } from "./src/scripts/auth";

import firebaseConfig from "../utils/firebase";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", e => {

    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    login(auth, email, password);

    console.log("logIn");

    if (user.isAdmin) {
        location.href = "./create-product.html";
    } else {
        location.href = "./ shop.html";
    }



});

const signinButotn = document.getElementById("signin");

signinButotn.addEventListener("click", e => {

    window.location.href="./html/signin.html";

});

