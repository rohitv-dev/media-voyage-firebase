export type Result<T> = { ok: true; data: T; message?: string } | { ok: false; data?: T; message: string };

export type ErrorInfo = {
  errorType: string;
  description: string;
};
