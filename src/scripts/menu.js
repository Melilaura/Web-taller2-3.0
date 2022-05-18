import { getProducts } from "./functions/products";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./app"
import { createFirebaseCart, getFirebaseCart } from "./functions/cart";
import { getMyLocalCart, addProductToCart, currencyFormat } from "../utils/index";


const goButton = product.querySelector(".banner__item");


goButton.addEventListener("click", async(e) => {
    e.preventDefault(); // evitar que al dar click en el boton, funcione el enlace del padre.

    window.location.href = "./login.html";

});