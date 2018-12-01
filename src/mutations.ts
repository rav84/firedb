import Vue from "vue";
import log from "loglevel";
import { getPathRefs, getNormalisedPathAndDocRef } from "./helpers";

const busyStack: boolean[] = [];

/**
 * Sets a document in a collection.
 * @param state state, passed by vuex
 * @param payload { path: path to a doc, value: data object }
 */
export function setDoc(state: FireDBState, payload: { path: string, value: any }) {
    const { collectionPath, docRef } = getNormalisedPathAndDocRef(payload.path);
    if (!collectionPath || !docRef) { log.error("setDoc: Invalid payload.", payload); return; }
    let s = state;
    for (const key of getPathRefs(collectionPath)) {
        if (!s[key]) { Vue.set(s, key, {}); }
        s = s[key];
    }
    Vue.set(s, docRef, payload.value);
}

/**
 * Removes a document from state.
 * @param state state, passed by vuex
 * @param path path to a document
 */
export function removeDoc(state: FireDBState, path: string) {
    const { collectionPath, docRef } = getNormalisedPathAndDocRef(path);
    if (!collectionPath || !docRef) { log.error("removeDoc: Invalid path.", path); return; }
    let s = state;
    for (const key of getPathRefs(collectionPath)) {
        if (!s[key]) { return; }
        s = s[key];
    }
    Vue.delete(s, docRef);
}

/**
 * Cleans the state by removing any empty objects along the path.
 * @param state state, passed by vuex
 * @param path path to clean
 */
export function cleanStateAfterUnregister(state: FireDBState, path: string) {
    const refs = getPathRefs(path);
    const docRef = refs.length % 2 === 0 ? refs.pop() : null;
    if (refs.length == 0 || !state[refs[0]]) { log.error("cleanStateAfterUnregister: Invalid path.", path); return; }
    const states: Array<{ name: string, state: object }> = [];
    for (const ref of refs) {
        if (!state[ref]) return; // Means path is not valid/mapped
        states.push({ name: ref, state });
        state = state[ref];
    }
    var docRefs = docRef ? [docRef] : Object.keys(state);
    docRefs.forEach((r) => Vue.delete(state, r));
    for (let s; s = states.pop();) {
        if (s.state[s.name] === null || typeof s.state[s.name] === "undefined" ||
            (typeof s.state[s.name] === "object" && Object.keys(s.state[s.name]).length === 0)) {
            Vue.delete(s.state, s.name);
        }
    }
}

/**
 * Sets fireDB module isBusy flag. Can be used for loading-bars in UI.
 * @param state state, passed by vuex
 * @param value If not passed isBusy is set to true, else value.
 */
export function setBusy(state: FireDBState, value?: boolean) {
    const v = typeof value === "undefined" ? true : value;
    if (v) {
        if (busyStack.length === 0) { state.isBusy = true; }
        busyStack.push(true);
    } else {
        busyStack.pop();
        if (busyStack.length === 0) { state.isBusy = false; }
    }
}