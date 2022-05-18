import { getProducts } from "./functions/products";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./app"
import { createFirebaseCart, getFirebaseCart } from "./functions/cart";
import { getMyLocalCart, addProductToCart, currencyFormat } from "../utils/index";


const productSection = document.getElementById("shop");
const categoryFilter = document.getElementById("category");
const orderFilter = document.getElementById("order");

let userLogged = undefined;
let products = [];
let cart = [];

async function loadProducts() {


    const firebaseProducts = await getProducts(db);
    productSection.innerHTML = ""; //hace que parezca que la pagina carga xdxd
    firebaseProducts.forEach(product => {
        renderProduct(product);
        console.log(product.id);
    });
    products = firebaseProducts;
    console.log(firebaseProducts);
}

function renderProduct(item) {
    const product = document.createElement("a");
    product.className = "shop__item"


    product.setAttribute("href", `./product.html?id=${item.id}`);
    console.log (item.id);

    
    const coverImage = item.images ? item.images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4sL0yEksBQCvRgm_47IrlR8cXSISNwOu6Zh5VUnUTLFm3ufYxdJoGRZOCl2gTp41ENqY&usqp=CAU"
 

    const isProductAddedToCart = cart.some((productCart) => productCart.id === item.id);

    const buttonCart = isProductAddedToCart ?
        '<button class="product__cart" disabled>Producto añadido</button>' :
        '<button class="product__cart">Añadir al carrito</button>';

    product.innerHTML = `
                <img class="shop__img" src="${coverImage}">
                <div class="shop__product">
                    <h3 class="shop__product">${item.name}</h3>
                    <h4 class="shop__price">${currencyFormat(item.price)}</h4>
                   ${buttonCart}
                </div>
                
    `;

    productSection.appendChild(product);

    const cartButton = product.querySelector(".product__cart");


    cartButton.addEventListener("click", async(e) => {
        e.preventDefault(); // evitar que al dar click en el boton, funcione el enlace del padre.

        cart.push(item);
        addProductToCart(cart);

        if (userLogged) {
            await createFirebaseCart(db, userLogged.uid, cart);
        }

        cartButton.setAttribute("disabled", true);
        cartButton.innerText = "Agregado al carrito";

    });


}



function filterBy() {
    const newCategory = categoryFilter.value;
    const newOrder = orderFilter.value;


    let filteredProducts = products;

    if (newCategory !== "") {
        filteredProducts = filteredProducts.filter((product) => product.category === newCategory);
        productSection.innerHTML = "";
        console.log(filteredProducts);


    } else {
        filteredProducts = products;
        console.log(filteredProducts)
    }

    if (newOrder === "down") {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        console.log(filteredProducts)

    }
    if (newOrder === "up") {
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);

    }



    productSection.innerHTML = "";
    filteredProducts.forEach(product => {
        renderProduct(product);
        
    });


}
categoryFilter.addEventListener("change", e => {
    //console.log();
    filterBy();


});

orderFilter.addEventListener("change", e => {
    //console.log();
    filterBy();


});


onAuthStateChanged(auth, async(user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        userLogged = user;
        cart = await getFirebaseCart(db, userLogged.uid);
        // ...
    } else {
        cart = getMyLocalCart();
        // User is signed out
        // ...
    }

    loadProducts();

});