import { db } from "../firebase/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where, 
  addDoc,
  deleteDoc
} from "firebase/firestore";

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

export async function fetchOffersByProductId(productId) {
  const q = query(
    collection(db, "offers"),
    where("productId", "==", productId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((docu) => ({
    id: docu.id,
    ...docu.data()
  }));
}

export async function fetchOrdersByProductId(productId) {
  const q = query(
    collection(db, "orders"),
    where("productId", "==", productId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((docu) => ({
    id: docu.id,
    ...docu.data()
  }));
}

export async function fetchFavoritesByUserId(userId) {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((docu) => ({
    id: docu.id,
    ...docu.data()
  }));
}

export async function addFavorite(userId, product) {
  await addDoc(collection(db, "favorites"), {
    userId,
    productId: product.id,
    productName: product.nombre,
    productImage: product.imagen,
    categoria: product.categoria,
    createdAt: new Date().toISOString()
  });
}

export async function removeFavorite(favoriteId) {
  await deleteDoc(doc(db, "favorites", favoriteId));
}