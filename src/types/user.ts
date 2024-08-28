export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type UserWithoutId = Omit<User, "uid">;
