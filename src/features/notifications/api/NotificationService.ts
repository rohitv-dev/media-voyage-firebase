import { Notification } from "../types/notification";
import { and, collection, doc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { COLLECTIONS } from "@utils/constants";

type NotificationService = {
  getUnreadNotifications: (uid: string) => Promise<Notification[]>;
  getReadNotifications: (uid: string) => Promise<Notification[]>;
  sendNotification: (data: Omit<Notification, "id" | "createdAt" | "hasRead">) => Promise<void>;
  readNotification: (id: string) => Promise<string>;
};

export const NotificationService: NotificationService = {
  async getUnreadNotifications(uid) {
    const snap = await getDocs(
      query(
        collection(firestore, COLLECTIONS.NOTIFICATIONS),
        and(where("for", "==", uid), where("hasRead", "==", false))
      )
    );
    const data = snap.docs.map((doc) => doc.data()) as Notification[];
    return data;
  },

  async getReadNotifications(uid) {
    const snap = await getDocs(
      query(
        collection(firestore, COLLECTIONS.NOTIFICATIONS),
        and(where("for", "==", uid), where("hasRead", "==", true)),
        limit(5)
      )
    );
    const data = snap.docs.map((doc) => doc.data()) as Notification[];
    return data;
  },

  async sendNotification(data) {
    const docu = doc(collection(firestore, COLLECTIONS.NOTIFICATIONS));
    await setDoc(docu, {
      ...data,
      id: docu.id,
      for: data.for,
      hasRead: false,
      createdAt: new Date(),
    } as Notification);
  },

  async readNotification(id) {
    const docu = doc(firestore, COLLECTIONS.NOTIFICATIONS, id);

    await updateDoc(docu, {
      hasRead: true,
    });

    return id;
  },
};
