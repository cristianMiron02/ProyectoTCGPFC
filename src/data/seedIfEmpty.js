import { db } from "../firebase/firebase.js";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { seedProducts } from "./seedProducts.js";

export async function seedIfEmpty() {
    const colRef = collection(db, "products");
    const snap = await getDocs(colRef);

    if (snap.empty) {
        console.log("Base de datos vacía. Insertando productos...");
        for (const product of seedProducts) {
            await addDoc(colRef, product);
        }
        console.log("Productos insertados correctamente.");
    } else {
        console.log("La colección ya tiene productos.");
    }
}
