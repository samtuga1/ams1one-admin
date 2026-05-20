import Axios from "@/api";
import {
  ILmcDetailCard,
  ILmcEditPayload,
  ILmcRegisterResponse,
  ILmcSummary,
  ILmcTransactionRow,
  ILmcTransactionsParams,
  ILmcWriterOverviewRow,
  IRegisterLmcOnboardingPayload,
} from "@/interfaces/lmc.interface";
import { IPaginatedResults } from "@/interfaces/writers.interface";
import { handleApiError } from "@/utils/api_error";

export type WritersOverviewParams = {
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
};

class LmcService {
  static registerSupervisorOnboarding = async (
    payload: IRegisterLmcOnboardingPayload,
  ): Promise<ILmcRegisterResponse> => {
    try {
      const hasPhoto = payload.photo instanceof File;
      let data: FormData | Omit<IRegisterLmcOnboardingPayload, "photo">;

      if (hasPhoto) {
        const formData = new FormData();
        formData.append("email", payload.email);
        formData.append("first_name", payload.first_name);
        formData.append("last_name", payload.last_name);
        formData.append("phone", payload.phone);
        formData.append("password", payload.password);
        if (payload.address) formData.append("address", payload.address);
        formData.append("photo", payload.photo as File);
        data = formData;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { photo: _, ...rest } = payload;
        data = rest;
      }

      const response = await Axios({
        url: `/api/v1/supervisors/register/`,
        method: "POST",
        data,
        headers: hasPhoto ? { "Content-Type": undefined } : undefined,
      });
      return response.data as ILmcRegisterResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchLmcOwners = async (): Promise<ILmcRegisterResponse[]> => {
    try {
      const response = await Axios({
        url: `/api/v1/supervisors/owners/`,
        method: "GET",
      });
      return response.data as ILmcRegisterResponse[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDetailCards = async (): Promise<ILmcDetailCard[]> => {
    try {
      const response = await Axios({
        url: `/api/v1/supervisors/detail-cards/`,
        method: "GET",
      });
      return response.data as ILmcDetailCard[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchSummary = async (lmcId: string): Promise<ILmcSummary> => {
    try {
      const response = await Axios({
        url: `/api/v1/supervisors/${lmcId}/summary/`,
        method: "GET",
      });
      return response.data as ILmcSummary;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWritersOverview = async (
    lmcId: string,
    params?: WritersOverviewParams,
  ): Promise<IPaginatedResults<ILmcWriterOverviewRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/supervisors/${lmcId}/writers-overview/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<ILmcWriterOverviewRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static editLmc = async (
    lmcId: string,
    payload: ILmcEditPayload,
  ): Promise<unknown> => {
    try {
      const hasPhoto = payload.photo instanceof File;
      let data: FormData | Omit<ILmcEditPayload, "photo">;

      if (hasPhoto) {
        const formData = new FormData();
        if (payload.first_name)
          formData.append("first_name", payload.first_name);
        if (payload.last_name) formData.append("last_name", payload.last_name);
        if (payload.phone) formData.append("phone", payload.phone);
        if (payload.address) formData.append("address", payload.address);
        formData.append("photo", payload.photo as File);
        data = formData;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { photo: _, ...rest } = payload;
        data = rest;
      }

      const response = await Axios({
        url: `/api/v1/supervisors/${lmcId}/edit/`,
        method: "PATCH",
        data,
        headers: hasPhoto ? { "Content-Type": undefined } : undefined,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchTransactions = async (
    lmcId: string,
    params?: ILmcTransactionsParams,
  ): Promise<IPaginatedResults<ILmcTransactionRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/supervisors/${lmcId}/transactions/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<ILmcTransactionRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default LmcService;
