import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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
import { FriendsService } from "@features/friends/api/FriendsService";
import { firebaseConverter } from "../utils/firebaseConverters";

export const MediaService = {
  async getSingleMedia(id: string): Promise<Result<Media>> {
    try {
      const snap = await getDoc(doc(firestore, COLLECTIONS.MEDIA, id).withConverter(firebaseConverter<Media>()));
      if (snap.exists()) return { ok: true, data: parseMedia(snap.data()) };
      return { ok: false, message: "Media Not Found" };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getFriendMedia(curUid: string, friendUid: string): Promise<Result<Media[]>> {
    try {
      const res = await FriendsService.isFriend(curUid, friendUid);

      if (!res.ok) return { ok: false, message: res.message };

      const q = query(
        collection(firestore, COLLECTIONS.MEDIA),
        where("uid", "==", friendUid),
        orderBy("updatedAt", "desc")
      ).withConverter(firebaseConverter<Media>());

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => parseMedia({ ...doc.data(), id: doc.id }));

      return { ok: true, data };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getMedia(uid: string): Promise<Result<Media[]>> {
    try {
      const q = query(
        collection(firestore, COLLECTIONS.MEDIA),
        where("uid", "==", uid),
        orderBy("updatedAt", "desc")
      ).withConverter(firebaseConverter<Media>());
      const snap = await getDocs(q);
      if (snap.empty) return handleEmptyResult();

      const data = pipe(
        snap.docs,
        map((doc) => parseMedia({ ...doc.data(), id: doc.id }))
      );

      return { ok: true, data };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async addMedia(media: Media): Promise<Result<Media>> {
    try {
      const ref = doc(collection(firestore, COLLECTIONS.MEDIA)).withConverter(firebaseConverter<Media>());
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

      const ref = doc(firestore, COLLECTIONS.MEDIA, media.id).withConverter(firebaseConverter<Media>());
      await updateDoc(ref, { ...modifiedDoc });
      return { ok: true, data: media };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async deleteMedia(id: string): Promise<Result<boolean>> {
    try {
      const res = await MediaService.getSingleMedia(id);
      if (!res.ok) return { ok: false, message: res.message };
      await deleteDoc(doc(firestore, COLLECTIONS.MEDIA, id));
      return { ok: true, data: true };
    } catch (err) {
      return handleResultError(err);
    }
  },
};
