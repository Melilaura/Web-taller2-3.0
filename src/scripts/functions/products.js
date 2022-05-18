import { collection, getDoc, getDocs } from "firebase/firestore";

async function getProducts(db) {
    const collectionRef = collection(db, "products");

    try {
        const { docs } = await getDocs(collectionRef);
        const products = docs.map((doc) => {

            return {
                ...doc.data(), 
                id:doc.id

            };
        });

        console.log(products);

        return products;
    } catch (e) {
        console.log(e);
    }

}

export {
    getProducts,
}