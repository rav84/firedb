import log from "loglevel";

// Mocking
const where = jest.fn(() => { return { onSnapshot } });
const collection = jest.fn((path) => {
    if (!path) throw new Error();
    return { where, onSnapshot }
});
const firestore = jest.fn(() => { return { collection } });
(firestore as any).FieldPath = { documentId: jest.fn().mockReturnValue(1) };
const onSnapshot = jest.fn((cb) => {
    if (!cb) throw new Error();
    cb({
        docChanges: () => {
            return [
                { type: "removed", doc: { data: () => 1 } },
                { type: "updated", doc: { data: () => 1 } }
            ];
        }
    });
    return unSubscribe;
});
let throwError = false;
const unSubscribe = jest.fn(() => { if (throwError) throw new Error(); });
const callback = jest.fn();
afterEach(() => { jest.clearAllMocks(); });
jest.mock("loglevel");
jest.mock("firebase/app", () => {
    return { firestore };
});

import * as fire from "./fire";

describe("Testing fire:firebase client", () => {
    test("to subscribe to a document path", () => {
        const path = "c/d/c1/d1";
        fire.subscribeToFirestoreChanges(path, callback);
        expect(firestore).toBeCalled();
        expect(collection).toBeCalledWith("c/d/c1");
        expect(where).toBeCalledWith(expect.anything(), "==", "d1");
        expect(callback).toBeCalled();
        fire.unSubscribeToFirestoreChanges(path);
        expect(unSubscribe).toHaveBeenCalled();
    });

    test("to subscribe to a collection path", () => {
        const path = "c/d/c1";
        fire.subscribeToFirestoreChanges(path, callback);
        expect(firestore).toBeCalled();
        expect(collection).toBeCalledWith(path);
        expect(callback).toBeCalled();
        fire.unSubscribeToFirestoreChanges(path);
        expect(unSubscribe).toHaveBeenCalled();
    });

    test("to log error when path is subscribed/unsubscribed twice", () => {
        const path = "c/d/c1";
        fire.subscribeToFirestoreChanges(path, callback);
        fire.subscribeToFirestoreChanges(path, callback);
        fire.unSubscribeToFirestoreChanges(path);
        fire.unSubscribeToFirestoreChanges(path);
        expect(log.error).toHaveBeenCalledTimes(2);
    });

    test("is logging error for exceptions", () => {
        fire.subscribeToFirestoreChanges(null as any, callback); // Throw error on collection()
        fire.subscribeToFirestoreChanges("a", null as any); // will throw error in onSnapshot
        throwError = true;
        fire.unSubscribeToFirestoreChanges("a"); // will throw error as throwError = true
        expect(log.error).toBeCalledTimes(3);
        throwError = false;
    });
});