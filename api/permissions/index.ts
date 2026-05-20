import Axios from "@/api";
import type {
  IDashboardPage,
  IDashboardRole,
  ICreateRolePayload,
} from "@/interfaces/admin-users.interface";
import { handleApiError } from "@/utils/api_error";

class PermissionsService {
  static fetchPages = async (): Promise<IDashboardPage[]> => {
    try {
      const response = await Axios({ url: `/api/v1/permissions/pages/`, method: "GET" });
      return response.data as IDashboardPage[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchRoles = async (): Promise<IDashboardRole[]> => {
    try {
      const response = await Axios({ url: `/api/v1/permissions/roles/`, method: "GET" });
      return response.data as IDashboardRole[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static createRole = async (payload: ICreateRolePayload): Promise<IDashboardRole> => {
    try {
      const response = await Axios({
        url: `/api/v1/permissions/roles/`,
        method: "POST",
        data: payload,
      });
      return response.data as IDashboardRole;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static updateRole = async (
    id: string,
    payload: Partial<ICreateRolePayload>,
  ): Promise<IDashboardRole> => {
    try {
      const response = await Axios({
        url: `/api/v1/permissions/roles/${id}/`,
        method: "PATCH",
        data: payload,
      });
      return response.data as IDashboardRole;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static deleteRole = async (id: string): Promise<void> => {
    try {
      await Axios({ url: `/api/v1/permissions/roles/${id}/`, method: "DELETE" });
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default PermissionsService;
