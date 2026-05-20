import type { IPaginatedResults } from "./writers.interface";

export interface IAdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  photo: string | null;
  date_joined?: string;
  dashboard_role: { id: string; name: string } | null;
}

export interface ICreateAdminUserPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  role?: string;
  role_id?: string | null;
  photo?: File;
}

export interface IEditAdminUserPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
  role_id?: string | null;
  photo?: File;
}

export interface IActivityLog {
  id: number;
  actor_name: string;
  actor_email: string;
  action: "login" | "create_admin" | "edit_admin";
  description: string;
  created_at: string;
}

export interface IDashboardPage {
  id: string;
  key: string;
  name: string;
  category: string;
  order: number;
  is_active: boolean;
}

export interface IDashboardRole {
  id: string;
  name: string;
  description: string;
  page_keys: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

export interface ICreateRolePayload {
  name: string;
  description?: string;
  page_keys?: string[];
}

export type IAdminUsersResponse = IPaginatedResults<IAdminUser>;
export type IActivityLogsResponse = IPaginatedResults<IActivityLog>;
