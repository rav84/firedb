import firebase from "firebase/app";
import "firebase/firestore";
import log from "loglevel";
import { getNormalisedPathAndDocRef } from "./helpers";

const subscribedPaths = {};

export async function subscribeToFirestoreChanges(path: string,
    callback: (path: string, value?: object) => void) {
    try {
        const db = firebase.firestore();
        if (subscribedPaths[path]) {
            log.error("subscribeToFirestoreChanges: Path already subscribed.", path);
            return;
        }
        const { collectionPath, docRef } = getNormalisedPathAndDocRef(path);
        const ref = docRef ?
            db.collection(collectionPath).where(firebase.firestore.FieldPath.documentId(), "==", docRef) :
            db.collection(collectionPath);
        subscribedPaths[path] = ref.onSnapshot((snapshot) => {
            try {
                snapshot.docChanges().forEach((change) => {
                    const value = change.type === "removed" ? undefined : change.doc.data();
                    callback(collectionPath, value);
                });
            } catch (e) { log.error(e); }
        });
    } catch (e) { log.error(e); }
}

export function unSubscribeToFirestoreChanges(path: string) {
    try {
        if (!subscribedPaths[path]) {
            log.error("unSubscribeToFirestoreChanges: Path not subscribed.", path);
            return;
        }
        subscribedPaths[path]();
        delete subscribedPaths[path];
    } catch (e) { log.error(e); }
} 