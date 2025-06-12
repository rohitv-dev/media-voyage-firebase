import {
  and,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
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
import { Media, MediaCount, MediaStatusEnum } from "../types/media";
import { handleEmptyResult, handleResultError } from "@utils/functions";
import { FriendsService } from "@features/friends/api/FriendsService";
import { firebaseConverter } from "../utils/firebaseConverters";

type MediaService = {
  getSingleMedia(id: string): Promise<Result<Media>>;
  getFriendMedia(curUid: string, friendUid: string): Promise<Result<Media[]>>;
  getMedia(uid: string): Promise<Result<Media[]>>;

  addMedia(uid: string, media: Media): Promise<Result<Media>>;
  updateMedia(media: Media): Promise<Result<Media>>;
  deleteMedia(id: string): Promise<Result<boolean>>;

  getMediaCount(uid: string): Promise<Result<MediaCount>>;
};

export const MediaService: MediaService = {
  async getSingleMedia(id) {
    try {
      const snap = await getDoc(doc(firestore, COLLECTIONS.MEDIA, id).withConverter(firebaseConverter<Media>()));
      if (snap.exists()) return { ok: true, data: parseMedia(snap.data()) };
      return { ok: false, message: "Media Not Found" };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getFriendMedia(curUid, friendUid) {
    try {
      const res = await FriendsService.isFriend(curUid, friendUid);

      if (!res.ok) return { ok: false, message: res.message };

      const q = query(
        collection(firestore, COLLECTIONS.MEDIA),
        and(where("uid", "==", friendUid), where("isPrivate", "==", false)),
        orderBy("updatedAt", "desc")
      ).withConverter(firebaseConverter<Media>());

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => parseMedia({ ...doc.data(), id: doc.id }));

      return { ok: true, data };
    } catch (err) {
      console.log(err);
      return handleResultError(err);
    }
  },

  async getMedia(uid) {
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

  async addMedia(uid, media) {
    try {
      const ref = doc(collection(firestore, COLLECTIONS.MEDIA)).withConverter(firebaseConverter<Media>());
      const mediaDoc: Media = {
        ...media,
        uid,

        id: ref.id,
      };
      await setDoc(ref, mediaDoc);
      return { ok: true, data: mediaDoc };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async updateMedia(media) {
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

  async deleteMedia(id) {
    try {
      const res = await MediaService.getSingleMedia(id);
      if (!res.ok) return { ok: false, message: res.message };
      await deleteDoc(doc(firestore, COLLECTIONS.MEDIA, id));
      return { ok: true, data: true };
    } catch (err) {
      return handleResultError(err);
    }
  },

  async getMediaCount(uid) {
    try {
      const queries = [
        MediaStatusEnum.enum.Completed,
        MediaStatusEnum.enum["In Progress"],
        MediaStatusEnum.enum.Planned,
        MediaStatusEnum.enum.Dropped,
      ].map((val) =>
        query(collection(firestore, COLLECTIONS.MEDIA), where("uid", "==", uid), where("status", "==", val))
      );

      const [countSnap, completedSnap, inProgressSnap, plannedSnap, droppedSnap] = await Promise.all([
        getCountFromServer(query(collection(firestore, COLLECTIONS.MEDIA), where("uid", "==", uid))),
        ...queries.map((q) => getCountFromServer(q)),
      ]);

      return {
        ok: true,
        data: {
          total: countSnap.data().count,
          completed: completedSnap.data().count,
          inProgress: inProgressSnap.data().count,
          planned: plannedSnap.data().count,
          dropped: droppedSnap.data().count,
        },
      };
    } catch (err) {
      return handleResultError(err);
    }
  },
};
