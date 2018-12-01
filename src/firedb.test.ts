import firedb from "./firedb";

jest.mock("loglevel");

const registerModule = jest.fn();

describe("Testing fireDB plugin", () => {
    test("to return a Vuex plugin", () => {
        const store: any = { registerModule };
        firedb(store);
        expect(registerModule).toBeCalledWith(["fireDB"], expect.anything());
    })
});