import Axios from "@/api";
import {
  IActivityLogsResponse,
  IAdminUser,
  IAdminUsersResponse,
  ICreateAdminUserPayload,
  IEditAdminUserPayload,
} from "@/interfaces/admin-users.interface";
import { handleApiError } from "@/utils/api_error";

class AdminUsersService {
  static fetchAdmins = async (params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<IAdminUsersResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/auth/users/admins/`,
        method: "GET",
        params,
      });
      return response.data as IAdminUsersResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static createAdmin = async (
    payload: ICreateAdminUserPayload,
  ): Promise<IAdminUser> => {
    try {
      const hasPhoto = payload.photo instanceof File;
      const data = hasPhoto ? new FormData() : { ...payload };

      if (hasPhoto) {
        const formData = data as FormData;
        formData.append("email", payload.email);
        formData.append("first_name", payload.first_name);
        formData.append("last_name", payload.last_name);
        formData.append("phone", payload.phone);
        formData.append("password", payload.password);
        if (payload.role) formData.append("role", payload.role);
        if (payload.role_id != null)
          formData.append("role_id", payload.role_id);
        formData.append("photo", payload.photo as File);
      }

      const response = await Axios({
        url: `/api/v1/auth/users/admins/`,
        method: "POST",
        data,
      });
      return response.data as IAdminUser;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static editAdmin = async (
    id: string,
    payload: IEditAdminUserPayload,
  ): Promise<IAdminUser> => {
    try {
      const hasPhoto = payload.photo instanceof File;
      const data = hasPhoto ? new FormData() : { ...payload };

      if (hasPhoto) {
        const formData = data as FormData;
        if (payload.email) formData.append("email", payload.email);
        if (payload.first_name)
          formData.append("first_name", payload.first_name);
        if (payload.last_name) formData.append("last_name", payload.last_name);
        if (payload.phone) formData.append("phone", payload.phone);
        if (payload.is_active != null)
          formData.append("is_active", String(payload.is_active));
        if (payload.role_id != null)
          formData.append("role_id", payload.role_id);
        formData.append("photo", payload.photo as File);
      }

      const response = await Axios({
        url: `/api/v1/auth/users/${id}/admin-edit/`,
        method: "PATCH",
        data,
      });
      return response.data as IAdminUser;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchActivityLogs = async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<IActivityLogsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/auth/users/activity-logs/`,
        method: "GET",
        params,
      });
      return response.data as IActivityLogsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default AdminUsersService;
