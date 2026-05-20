import { IUser } from "./user.interface";

export interface IAuth {
  access: string;
  refresh: string;
  user?: IUser;
  pages?: string[] | "*";
}

export interface IMyPagesResponse {
  role: string;
  is_superuser: boolean;
  pages: string[] | "*";
}

export interface ILogInRequest {
  email: string;
  password: string;
}
