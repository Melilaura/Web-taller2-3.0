/*import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//import { storage, db } from "../app";

import firebaseConfig from "../../utils/firebase";

import { addProduct, uploadImages } from "./addProduct";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

//console.log(storage);
//console.log(app); */


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//import firebaseConfig from "../utils/firebase";
import firebaseConfig from "../utils/firebase";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);


//import { storage, db } from "../app"
//import { addProduct, uploadImages } from "./functions/addProduct";
import { addProduct, uploadImages } from "./functions/addProduct";

const createProductForm = document.getElementById('productForm');

createProductForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    console.log("Create a new product");

    const name = createProductForm.nombreProducto.value;
    const description = createProductForm.descripcion.value;
    const price = createProductForm.precio.value;
    const category = createProductForm.categoria.value;
    const images = createProductForm.images.files;

    let gallery = []

    if (images.length) {
        const uploadedImages = await uploadImages(storage, [...images]);
        gallery = await Promise.all(uploadedImages);
    }

    const newProduct = {
        name,
        description,
        price,
        category,
        images: gallery,
    };

    await addProduct(db, newProduct);
    alert("Nuevo producto agregado");
    productFor.reset();
});