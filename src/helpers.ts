/**
 * Returns elements of a firestore path as string array.
 * @param path Path to collection or a document
 */
export function getPathRefs(path: string) {
  return path ? path.trim().split("/").filter(r => !!r) : [];
}

/**
 * Returns collection-path and doc-reference from path.
 * If path points to collection, docRef will be null.
 * @param path Path to a collection or document
 */
export function getNormalisedPathAndDocRef(path: string) {
  const keys = getPathRefs(path);
  const docRef = keys.length % 2 === 0 ? keys.pop() : null;
  return { collectionPath: keys.join("/"), docRef: docRef || null };
}
