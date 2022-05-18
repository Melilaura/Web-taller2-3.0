import { db, auth } from "./app";
import { onAuthStateChanged } from "firebase/auth";
import { getProduct } from "./functions/getProduct";
import { getFirebaseCart, createFirebaseCart } from "./functions/cart";
import { getMyLocalCart, addProductToCart, currencyFormat } from "../utils";

const productInfoSection = document.getElementById("product__info");
const productAssetsSection = document.getElementById("product__assets");

let userLogged = undefined;
let cart = [];

function getParam(param) {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
 
    const productId = searchParams.get(param);
    console.log (searchParams);
    return productId;
    
}

async function loadProduct() {
    const productId = getParam("id"); // http://localhost:1234/product.html?id=TXQ9Wf1GIoAOJLkIEMYo&age=20
    const data = await getProduct(productId);

    const product = {
        ...data,
        id: productId, // docSnap.id,
    }

    console.log(product);
    renderProduct(product);
}


function renderProduct(product) {

    productAssetsSection.innerHTML = `
    <div class="gallery__center">

                 <img  class="mainImage" id="mainImage" src="${product.images[0]}">
            </div>
    `;

    const isProductAddedToCart = cart.some((productCart) => productCart.id === product.id);


    const productCartBtn = isProductAddedToCart ?
    '<button class="product__cart" disabled>Producto añadido</button>' :
    '<button class="product__cart">Añadir al carrito</button>';

    productInfoSection.innerHTML = ` 
    <div class="product__easy">
    <div class="info__basic" >
        <h1 class="product__name">${product.name}</h1>
        <h3 class="product__price">${currencyFormat(product.price)}</h3>
    </div>
    <div class="button__add">
    ${productCartBtn}
    </div>
</div>
    <p class="product__description ">${product.description}</p>
</div>

</div>`;

    if (product.images.length > 1) {
        createGallery(product.images);
    }

    const productCart =document.querySelector(".product__cart");
    productCart.addEventListener("click", e => {
        cart.push(product);


        addProductToCart(cart);

        if (userLogged) {
            createFirebaseCart(db, userLogged.uid, cart);
        }

        productCart.setAttribute("disabled", true);

        productCart.innerText = "Producto añadido";
    });
}

function createGallery(images) {
    const mainImage = document.getElementById("mainImage");
    const gallery = document.createElement("div");
    gallery.className = "product__gallery";
    
    images.forEach(image => {
        gallery.innerHTML += `<img src="${image}">`;
    });

    productAssetsSection.appendChild(gallery);

    const galleryImages = document.querySelector(".product__gallery");

    galleryImages.addEventListener("click", e => {
        if (e.target.tagName === "IMG") {
            mainImage.setAttribute("src", e.target.currentSrc);

        }
    });
}

onAuthStateChanged(auth, async(user) => {

    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        userLogged = user;
        cart = await getFirebaseCart(db, userLogged.uid);
        console.log(cart);
        // ...
    } else {
       cart = getMyLocalCart();       // User is signed out
        // ...
    }

    
    loadProduct();

});