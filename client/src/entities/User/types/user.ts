export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export type accessToken = string;
export type refreshToken = string;
