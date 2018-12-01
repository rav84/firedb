import { getPathRefs, getNormalisedPathAndDocRef } from "./helpers";

describe("Testing helper function", () => {

  test("getPathRefs: with valid and invalid inputs", () => {

    const results = [null, " ", "ref", "ref/", "r1/r2/r3", "r1//r2"]
      .map((t) => getPathRefs(t as any));

    expect(results).toEqual([
      [],
      [],
      ["ref"],
      ["ref"],
      ["r1", "r2", "r3"],
      ["r1", "r2"]]);
  });

  test("getNormalisedPathAndDocRef: with valid and invalid inputs", () => {

    const results = [null, " ", "c1/d1/", "c1/d1/c2", "c1/d1/c2/d2"]
      .map((t) => getNormalisedPathAndDocRef(t as any));

    expect(results).toEqual([
      { collectionPath: "", docRef: null },
      { collectionPath: "", docRef: null },
      { collectionPath: "c1", docRef: "d1" },
      { collectionPath: "c1/d1/c2", docRef: null },
      { collectionPath: "c1/d1/c2", docRef: "d2" }
    ]);
  });
});
