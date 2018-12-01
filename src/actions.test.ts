import { registerPath, unregisterPath } from "./actions";
import { subscribeToFirestoreChanges, unSubscribeToFirestoreChanges } from "./fire";
import { getNormalisedPathAndDocRef } from "./helpers";
import log from "loglevel";

afterEach(() => { jest.clearAllMocks(); });

// Mocking
jest.mock("loglevel");
jest.mock("./fire.ts", () => {
    return {
        subscribeToFirestoreChanges: jest.fn((path: string, callback: any) => {
            let { collectionPath, docRef } = getNormalisedPathAndDocRef(path);
            docRef = docRef || "doc";
            callback(`${collectionPath}/${docRef}`, {}); // add doc
            callback(`${collectionPath}/${docRef}`); // remove doc
        }),
        unSubscribeToFirestoreChanges: jest.fn((path: string) => { })
    };
});

const setDoc = jest.fn();
const removeDoc = jest.fn();
const cleanStateAfterUnregister = jest.fn();
const actionContext: any = {
    commit: jest.fn((type, payload) => {
        switch (type) {
            case "setDoc": setDoc({}, payload); break;
            case "removeDoc": removeDoc({}, payload); break;
            case "cleanStateAfterUnregister": cleanStateAfterUnregister({}, payload); break;
        }
    }),
    dispatch: jest.fn()
};

describe("Testing actions", () => {

    test("To register and unregister collection successfully", async () => {
        const path = "collection";
        await registerPath(actionContext, path);
        expect(subscribeToFirestoreChanges).toBeCalledWith(path, expect.anything());
        expect(setDoc).toBeCalledWith(expect.anything(), { path: expect.stringMatching(/collection[/]doc/), value: {} });
        expect(removeDoc).toBeCalledWith(expect.anything(), { path: expect.stringMatching(/collection[/]doc/) });

        await unregisterPath(actionContext, path);
        expect(unSubscribeToFirestoreChanges).toBeCalledWith(path);
        expect(cleanStateAfterUnregister).toBeCalledWith(expect.anything(), expect.stringMatching(/collection/));
    });

    test("To register and unregister document successfully", async () => {
        const path = "collection/d";
        await registerPath(actionContext, path);
        expect(subscribeToFirestoreChanges).toBeCalledWith(path, expect.anything());
        expect(setDoc).toBeCalledWith(expect.anything(), { path: expect.stringMatching(/collection[/]d/), value: {} });
        expect(removeDoc).toBeCalledWith(expect.anything(), { path: expect.stringMatching(/collection[/]d/) });

        await unregisterPath(actionContext, path);
        expect(unSubscribeToFirestoreChanges).toBeCalledWith(path);
        expect(cleanStateAfterUnregister).toBeCalledWith(expect.anything(), expect.stringMatching(/collection[/]d/));
    });
    test("to prevent register of a path twice", async () => {
        const path = "collection/d";
        await registerPath(actionContext, path);
        await registerPath(actionContext, path);
        await unregisterPath(actionContext, path)
        await unregisterPath(actionContext, path);
        expect(log.error).toHaveBeenCalledTimes(2);
    });
});
