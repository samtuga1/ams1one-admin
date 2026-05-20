export type IUserRole =
  | "superuser"
  | "operations_manager"
  | "director"
  | "executive_secretary"
  | "administrator"
  | "finance_manager";

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  photo: string | null;
}
