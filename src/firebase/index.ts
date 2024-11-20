import * as Firestore from 'firebase/firestore'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD7egn55TYeUXQakvnaptQSvECX2I7BNjQ",
    authDomain: "bim-dev-master-a9320.firebaseapp.com",
    projectId: "bim-dev-master-a9320",
    storageBucket: "bim-dev-master-a9320.appspot.com",
    messagingSenderId: "209234520823",
    appId: "1:209234520823:web:6779842fdb23cf7b9cc1f2"
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = Firestore.getFirestore();

export function getCollection<T>(path: string) {
    return Firestore.collection(firebaseDB, path) as Firestore.CollectionReference<T>;
}

export function getSubCollection<T>(parentPath: string, subCollectionPath: string) {
    const fullPath = `${parentPath}/${subCollectionPath}`;
    return Firestore.collection(firebaseDB, fullPath) as Firestore.CollectionReference<T>;
}

// export function deleteDocument<T>(collection: Firestore.CollectionReference<T>, docId: string) {
//     return Firestore.deleteDoc(Firestore.doc(collection, docId));
// }

export async function deleteDocument(path: string, id: string) {
    const doc = Firestore.doc(firebaseDB, `${path}/${id}`);
    await Firestore.deleteDoc(doc);
}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T) {
    const doc = Firestore.doc(firebaseDB, `${path}/${id}`);
    await Firestore.updateDoc(doc, data);
}

