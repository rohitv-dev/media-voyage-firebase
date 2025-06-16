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
import { omitBy, pipe } from "remeda";
import { firestore } from "@/services/firebase";
import { COLLECTIONS } from "@utils/constants";
import { parseMedia } from "../utils/converters";
import { Media, MediaCount, MediaStatusEnum } from "../types/media";
import { FriendsService } from "@features/friends/api/FriendsService";
import { firebaseConverter } from "../utils/firebaseConverters";

type MediaService = {
  getSingleMedia(id: string): Promise<Media>;
  getFriendMedia(curUid: string, friendUid: string): Promise<Media[]>;
  getMedia(uid: string): Promise<Media[]>;

  addMedia(uid: string, media: Media): Promise<Media>;
  updateMedia(media: Media): Promise<Media>;
  deleteMedia(id: string): Promise<boolean>;

  getMediaCount(uid: string): Promise<MediaCount>;
};

export const MediaService: MediaService = {
  async getSingleMedia(id) {
    const snap = await getDoc(doc(firestore, COLLECTIONS.MEDIA, id).withConverter(firebaseConverter<Media>()));
    if (snap.exists()) return parseMedia(snap.data());
    else throw new Error("Media Not Found");
  },

  async getFriendMedia(curUid, friendUid) {
    const isFriend = await FriendsService.isFriend(curUid, friendUid);

    if (!isFriend) throw new Error("You are not friends with the user");

    const q = query(
      collection(firestore, COLLECTIONS.MEDIA),
      and(where("uid", "==", friendUid), where("isPrivate", "==", false)),
      orderBy("updatedAt", "desc")
    ).withConverter(firebaseConverter<Media>());

    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => parseMedia({ ...doc.data(), id: doc.id }));

    return data;
  },

  async getMedia(uid) {
    const q = query(
      collection(firestore, COLLECTIONS.MEDIA),
      where("uid", "==", uid),
      orderBy("updatedAt", "desc")
    ).withConverter(firebaseConverter<Media>());

    const snap = await getDocs(q);

    if (snap.empty) return [];

    return snap.docs.map((doc) => parseMedia({ ...doc.data(), id: doc.id }));
  },

  async addMedia(uid, media) {
    const ref = doc(collection(firestore, COLLECTIONS.MEDIA)).withConverter(firebaseConverter<Media>());
    const mediaDoc: Media = {
      ...media,
      uid,

      id: ref.id,
    };
    await setDoc(ref, mediaDoc);
    return mediaDoc;
  },

  async updateMedia(media) {
    if (!media.id) throw new Error("Invalid Media ID");

    const modifiedDoc = pipe(
      { ...media, updatedAt: new Date() } as Media,
      omitBy((val) => val === undefined)
    );

    const ref = doc(firestore, COLLECTIONS.MEDIA, media.id).withConverter(firebaseConverter<Media>());
    await updateDoc(ref, { ...modifiedDoc });
    return media;
  },

  async deleteMedia(id) {
    await MediaService.getSingleMedia(id);
    await deleteDoc(doc(firestore, COLLECTIONS.MEDIA, id));
    return true;
  },

  async getMediaCount(uid) {
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
      total: countSnap.data().count,
      completed: completedSnap.data().count,
      inProgress: inProgressSnap.data().count,
      planned: plannedSnap.data().count,
      dropped: droppedSnap.data().count,
    };
  },
};
