import { auth, db } from "../firebase/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function registerWithEmail(email, password, userData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    email: cred.user.email,
    username: userData.username,
    nombre: userData.nombre,
    apellidos: userData.apellidos,
    fechaNacimiento: userData.fechaNacimiento,
    tipoCuenta: userData.tipoCuenta,
    nacionalidad: userData.nacionalidad,
    createdAt: new Date().toISOString()
  });

  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutFirebase() {
  await signOut(auth);
}