import { setDoc, removeDoc, cleanStateAfterUnregister, setBusy } from "./mutations";
import log from "loglevel";

jest.mock("loglevel");
afterEach(() => { jest.clearAllMocks(); });

describe("Testing Mutations", () => {

    //setDoc
    test("setDoc: sets a document on existing collection", () => {
        const state: any = { c1: { d1: { c11: {} } } };
        setDoc(state, { path: "c1/d1/c11/d11", value: { a: 1 } });
        expect(state.c1.d1.c11.d11.a).toEqual(1);
    });
    test("setDoc: sets a document on non-existing collection", () => {
        const state: any = {};
        setDoc(state, { path: "c1/d1/c11/d11", value: { a: 1 } });
        expect(state.c1.d1.c11.d11.a).toEqual(1);
    });
    test("setDoc: with invalid input", () => {
        const state: any = { c1: { d1: { c11: {} } } };
        const state2 = JSON.parse(JSON.stringify(state));
        // path must be to a document
        setDoc(state, { path: "invalid", value: { a: 1 } });
        setDoc(state, { path: "a/invalid/path", value: { a: 1 } });
        // path cannot be empty
        setDoc(state, { path: "", value: { a: 1 } });
        expect(log.error).toHaveBeenCalledTimes(3);
        expect(state).toEqual(state2);
    });

    //removeDoc
    test("removeDoc: removes a exisiting doc", () => {
        const state: any = { c1: { d1: { c2: { d1: {}, d2: {} } } } };
        removeDoc(state, "c1/d1/c2/d2");
        expect(state.c1.d1.c2.d1).not.toBeUndefined();
        expect(state.c1.d1.c2.d2).toBeUndefined();
    });
    test("removeDoc: ignores invalid path", () => {
        const state: any = { c1: { d1: { c2: { d1: {}, d2: {} } } } };
        const state2 = JSON.parse(JSON.stringify(state));
        removeDoc(state, "invalid/path");
        removeDoc(state, "");
        expect(state).toEqual(state2);
    });

    //setBusy
    test("setBusy: is setting the flag", () => {
        const state: any = { isBusy: false };
        setBusy(state);
        expect(state.isBusy).toEqual(true);
        setBusy(state, false);
        expect(state.isBusy).toEqual(false);
    });
    test("setBusy: nested calls are working okay", () => {
        const state2: any = { isBusy: false };
        setBusy(state2);
        setBusy(state2);
        setBusy(state2, false);
        expect(state2.isBusy).toEqual(true);
        setBusy(state2, false);
        expect(state2.isBusy).toEqual(false);
    });

    //cleanStateAfterUnregister
    test("cleanStateAfterUnregister: with collection path", () => {
        const state: any = { c1: { d1: { c11: { a: {}, b: {} } }, d2: {} } };
        cleanStateAfterUnregister(state, "c1/d1/c11");
        expect(state.c1.d1).toBeUndefined();
        expect(state.c1.d2).not.toBeUndefined();
    });
    test("cleanStateAfterUnregister: with document path", () => {
        const state: any = { c1: { d1: { c11: { a: {}, b: {} } } } };
        cleanStateAfterUnregister(state, "c1/d1/c11/a");
        expect(state.c1.d1.c11.a).toBeUndefined();
        expect(state.c1.d1.c11.b).not.toBeUndefined();
    });
    test("cleanStateAfterUnregister: with invalid path", () => {
        const state: any = { c1: { d1: { c11: { a: {}, b: {} } } } };
        const state2 = JSON.parse(JSON.stringify(state));
        cleanStateAfterUnregister(state, "");
        cleanStateAfterUnregister(state, "c1/invalid/path");
        expect(state).toEqual(state2);
    });


});
