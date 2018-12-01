import { ActionContext } from "vuex";
import { subscribeToFirestoreChanges, unSubscribeToFirestoreChanges } from "./fire";
import log from "loglevel";

const registeredPaths = {};

/**
 * Registers a path from firestore with live updates.
 * @param param0 ActionContext provided by Vuex
 * @param path Path to a collection or a document.
 */
export async function registerPath({ commit }: ActionContext<FireDBState, any>, path: string) {
    try {
        commit("setBusy");
        if (registeredPaths[path]) {
            log.error("registerPath: Path already registered.", path);
            return;
        }
        await subscribeToFirestoreChanges(path, (path: string, value?: object) => {
            try {
                commit("setBusy");
                if (value) { commit("setDoc", { path, value }); }
                else { commit("removeDoc", { path }) }
            } finally { commit("setBusy", false); }
        });
        registeredPaths[path] = true;
    } finally { commit("setBusy", false); }
}

/**
 * Un-Registers a path from firestore and remove any data from state.
 * Un-Registers all registrations if no path is provided
 * @param param0 ActionContext provided by Vuex
 * @param path Path to a collection or a document, which was used when registering.
 */
export async function unregisterPath({ commit }: ActionContext<FireDBState, any>, path: string) {
    try {
        commit("setBusy");
        if (!registeredPaths[path]) {
            log.error("unregisterPath: Path is not registered.", path);
            return;
        }
        unSubscribeToFirestoreChanges(path);
        commit("cleanStateAfterUnregister", path);
        delete registeredPaths[path];
    } finally { commit("setBusy", false); }
}