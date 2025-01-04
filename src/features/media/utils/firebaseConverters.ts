import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from "firebase/firestore";

export const firebaseConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot<T>): T => snap.data(),
});
