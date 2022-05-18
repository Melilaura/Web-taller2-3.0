import {auth, db} from "./app";
import {onAuthStateChanged} from "firebase/auth";
import {getFirebaseCart, createFirebaseCart, createFirebaseOrder} from "./functions/cart";
import { addProductToCart } from "../utils/index";
import {getMyLocalCart, currencyFormat} from "../utils/index";

const cartSection = document.getElementById("cart");
const totalSection = document.getElementById("totalPrice");

const checkoutForm = document.getElementById("checkout__Form");

let cart = [];
let total = 0;
let order = [];

userLogged=undefined;

function loadCart(cart){
   
cart.forEach(product => {
    
    order.push(product);
    renderProduct(product);
    console.log(order);
    total += parseInt(product.price);
});

totalSection.innerText = currencyFormat(total);

}




async function removeProduct(productId){
    const newCart = cart.filter (product => product.id !== productId);
    cart= newCart;

    if(userLogged){
        await createFirebaseCart(db, userLogged.uid, newCart);
    }
    addProductToCart(newCart);

    cartSection.innerHTML= "";
    loadCart(newCart);
}

function renderProduct(product){

    const productCart = document.createElement("li");
   productCart.className="product";
    productCart.innerHTML = `
    <img class="shop__img" src=${product.images[0]}>
    <div class="shop__info">
        <h3 class="shop__product">${product.name}</h3>
        <h4 class="shop__price">${currencyFormat(product.price)}</h4>
        <button class="button__delete">Eliminar</button>
    </div>
`;
cartSection.appendChild(productCart);

productCart.addEventListener ("click", e =>{
if(e.target.tagName === "BUTTON"){
removeProduct(product.id);
}
});


}

checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = checkoutForm.nombre.value;
    const address = checkoutForm.direccion.value;
    const city = checkoutForm.ciudad.value;
    const cellphone = checkoutForm.cellphone.value;
    const cardNum = checkoutForm.card.value;
    const date = checkoutForm.date.value;
    const ccv = checkoutForm.ccv.value;

    const userInfo = {
       name,
       address,
       city, 
       cellphone 
    }

    const paymentInfo = {
        cardNum,
        date,
        ccv
    }

    const fullOrder = {
        userInfo,
        paymentInfo,
        order,
        total
    }

       await createFirebaseOrder(db, userLogged.uid, fullOrder);

    alert("ORDER READY");
    //window.location.href = "/index.html";
    checkoutForm.reset();
});

onAuthStateChanged(auth, async (user) => {

    
    if (user) {
        console.log(user);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      userLogged = user;
      cart = await getFirebaseCart(db, userLogged.uid);
    } else {
        cart = getMyLocalCart();
        alert("Por favor, registrate o inicia sesion para poder continuar");

       window.location.href = "./login.html";
      // User is signed out
      // ...
    }

    loadCart(cart);

  });
