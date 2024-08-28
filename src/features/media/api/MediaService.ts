import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { map, omitBy, pipe } from "remeda";
import { firestore } from "@/services/firebase";
import { COLLECTIONS } from "@utils/constants";
import { Result } from "@/types/api";
import { parseMedia } from "../utils/converters";
import { Media } from "../types/media";
import { handleEmptyResult, handleResultError } from "@utils/functions";

const mediaConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot<T>): T => snap.data(),
});

export const MediaService = {
  async getSingleMedia(id: string): Promise<Result<Media>> {
    try {
      const snap = await getDoc(doc(firestore, COLLECTIONS.MEDIA, id).withConverter(mediaConverter<Media>()));
      if (snap.exists()) return { ok: true, data: parseMedia(snap.data()) };
      return { ok: false, message: "Media Not Found" };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getMedia(uid: string): Promise<Result<Media[]>> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.MEDIA),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      ).withConverter(mediaConverter<Media>());
      const snap = await getDocs(q);
      if (snap.empty) return handleEmptyResult();

      const data = pipe(
        snap.docs,
        map((doc) => parseMedia({ ...doc.data(), id: doc.id }))
      );

      return { ok: true, data };
    } catch (err) {
      console.log(err);
      return handleResultError(err);
    }
  },

  async addMedia(media: Media): Promise<Result<Media>> {
    try {
      const ref = doc(collection(firestore, COLLECTIONS.MEDIA)).withConverter(mediaConverter<Media>());
      const mediaDoc: Media = {
        ...media,
        id: ref.id,
      };
      await setDoc(ref, mediaDoc);
      return { ok: true, data: mediaDoc };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async updateMedia(media: Media): Promise<Result<Media>> {
    try {
      if (!media.id) return { ok: false, message: "Invalid Media ID" };

      const modifiedDoc = pipe(
        { ...media, updatedAt: new Date() } as Media,
        omitBy((val) => val === undefined)
      );

      const ref = doc(firestore, COLLECTIONS.MEDIA, media.id).withConverter(mediaConverter<Media>());
      await updateDoc(ref, { ...modifiedDoc });
      return { ok: true, data: media };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async deleteMedia(id: string): Promise<Result<boolean>> {
    try {
      await deleteDoc(doc(firestore, COLLECTIONS.MEDIA, id));
      return { ok: true, data: true };
    } catch (err) {
      return handleResultError(err);
    }
  },
};
