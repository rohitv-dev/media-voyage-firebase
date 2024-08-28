import { FirebaseError } from "firebase/app";
import { Result } from "../types/api";
import { Timestamp } from "firebase/firestore";
import { isDate } from "remeda";

export const handleResultError = <T>(err: unknown): Result<T> => {
  if (err instanceof FirebaseError) return { ok: false, message: err.message };
  return { ok: false, message: `${err}` };
};

export const handleEmptyResult = <T>(): Result<T[]> => {
  return { ok: true, data: [] };
};

export const getDate = (date: Timestamp | Date): Date => {
  if (isDate(date)) return date;
  return date.toDate();
};
