import { db } from "../firebase/firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";


export async function fetchProducts() {
  const snap = await getDocs(collection(db, "products"));

  return snap.docs.map((docu) => ({
    id: docu.id,
    ...docu.data()
  }));
}


export async function fetchProductById(id) {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}
