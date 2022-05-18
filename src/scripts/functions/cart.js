import { getDoc, setDoc, doc } from "firebase/firestore";
async function createFirebaseCart(db, userId, cart) {
    try {
        await setDoc(doc(db, "cart", userId), { cart });

    } catch (e) {
        console.log(e);
    }
}

async function getFirebaseCart(db, userId) {

    const docRef = doc(db, "cart", userId);
    const docSnap = await getDoc(docRef);
    const result = docSnap.data();
    return (result) ? result.cart : [];
}
async function createFirebaseOrder (db, userId, order) {
    try {
        await setDoc(doc(db, "order", userId), {
            order
        });
        console.log(db);
    } catch (e) {
        console.log(e);
    }
}   

async function deleteCart(db, userId) {
    try {
        const docRef = doc(db, "cart", userId);
        await deleteDoc(docRef)
    } catch (error) {
        console.log(error);
    }
}


export {
    getFirebaseCart,
    createFirebaseCart,
    createFirebaseOrder,
    deleteCart,
}