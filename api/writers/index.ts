import Axios from "@/api";
import {
  IActiveWriterDailyStats,
  IAvailableFloat,
  IPaginatedResults,
  IPOSDeviceLocation,
  IRegisterWriterPayload,
  IRegisterWriterResponse,
  ITodayTopUp,
  ITop10Writer,
  IWriterCashoutRow,
  IWriterEditData,
  IWriterEditPayload,
  IWriterListRow,
  IWriterProfile,
  IWriterSaleRow,
  IWriterStatisticsData,
  IWriterTopupRow,
  IWriterWinningRow,
} from "@/interfaces/writers.interface";
import { handleApiError } from "@/utils/api_error";

class WritersService {
  static fetchStatistics = async (): Promise<IWriterStatisticsData> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/statistics/`,
        method: "GET",
      });
      // Backend response shape can vary (either { data: ... } or the object directly)
      const raw = response.data as unknown;

      const extracted: IWriterStatisticsData | undefined =
        raw != null &&
        typeof raw === "object" &&
        "data" in raw &&
        (raw as { data?: unknown }).data != null
          ? ((raw as { data?: unknown }).data as IWriterStatisticsData)
          : (raw as IWriterStatisticsData | undefined);

      // React Query queryFn must never resolve to undefined
      return (
        extracted ?? {
          totalwriterFloat: "",
          totalwriters: "0",
          writers: [],
        }
      );
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchAvailableFloat = async (): Promise<IAvailableFloat> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/available-float/`,
        method: "GET",
      });
      return response.data as IAvailableFloat;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchTodayTopUp = async (): Promise<ITodayTopUp> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/today-topup/`,
        method: "GET",
      });
      return response.data as ITodayTopUp;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchTop10Writers = async (limit = 10): Promise<ITop10Writer[]> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/top-writers/`,
        method: "GET",
        params: { limit },
      });
      return (response.data?.writers ?? []) as ITop10Writer[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchActiveWriterDailyStats = async (
    days?: number,
  ): Promise<IActiveWriterDailyStats> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/active-writer-daily-stats/`,
        method: "GET",
        params: days != null ? { days } : undefined,
      });
      const raw = response.data as
        | IActiveWriterDailyStats
        | { data?: IActiveWriterDailyStats }
        | { results?: IActiveWriterDailyStats["days"] }
        | { months?: IActiveWriterDailyStats["months"] };

      const payload =
        raw != null &&
        typeof raw === "object" &&
        "data" in raw &&
        (raw as { data?: unknown }).data != null
          ? (raw as { data: unknown }).data
          : raw;

      const base =
        payload && typeof payload === "object"
          ? (payload as Partial<IActiveWriterDailyStats>)
          : {};

      const normalizedDays = Array.isArray(base.days)
        ? base.days
        : Array.isArray(base.months)
          ? (base.months ?? []).map((m) => ({
              day: m.month,
              total_writers: m.total_writers,
              active_writers: m.active_writers,
            }))
          : Array.isArray(
                (payload as { results?: unknown } | undefined)?.results,
              )
            ? ((payload as { results: IActiveWriterDailyStats["days"] })
                .results ?? [])
            : [];

      return {
        totals: base.totals ?? {
          total_writers: 0,
          active_writers: 0,
        },
        download_url: base.download_url,
        period: base.period ?? {
          start_date: "",
          end_date: "",
          days: days ?? normalizedDays.length,
        },
        days: normalizedDays,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchAllWriters = async (params?: {
    search?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<IPaginatedResults<IWriterListRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/all/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<IWriterListRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWriterProfile = async (
    writerId: string,
  ): Promise<IWriterProfile> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/${writerId}/profile/`,
        method: "GET",
      });

      return response.data as IWriterProfile;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWriterSales = async (
    writerId: string,
    params?: { page?: number; page_size?: number },
  ): Promise<IPaginatedResults<IWriterSaleRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/${writerId}/writer-sales/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<IWriterSaleRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWriterWinnings = async (
    writerId: string,
    params?: { page?: number; page_size?: number },
  ): Promise<IPaginatedResults<IWriterWinningRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/${writerId}/writer-winnings/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<IWriterWinningRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWriterTopups = async (
    writerId: string,
    params?: { page?: number; page_size?: number },
  ): Promise<IPaginatedResults<IWriterTopupRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/${writerId}/writer-topups/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<IWriterTopupRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWriterCashouts = async (
    writerId: string,
    params?: { page?: number; page_size?: number },
  ): Promise<IPaginatedResults<IWriterCashoutRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/${writerId}/writer-cashouts/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<IWriterCashoutRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWriterDetail = async (
    writerId: string,
  ): Promise<IWriterEditData> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/${writerId}/`,
        method: "GET",
      });

      return response.data as IWriterEditData;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static editWriter = async (
    writerId: string,
    payload: IWriterEditPayload,
  ): Promise<IWriterEditData> => {
    try {
      const hasFile =
        payload.photo instanceof File || payload.id_card_image instanceof File;

      let data: FormData | IWriterEditPayload;

      if (hasFile) {
        const formData = new FormData();
        if (payload.first_name)
          formData.append("first_name", payload.first_name);
        if (payload.last_name) formData.append("last_name", payload.last_name);
        if (payload.email) formData.append("email", payload.email);
        if (payload.phone) formData.append("phone", payload.phone);
        if (payload.location_address)
          formData.append("location_address", payload.location_address);
        if (payload.date_of_birth)
          formData.append("date_of_birth", payload.date_of_birth);
        if (payload.supervisor_id)
          formData.append("supervisor_id", payload.supervisor_id);
        if (payload.photo instanceof File)
          formData.append("photo", payload.photo);
        if (payload.id_card_image instanceof File)
          formData.append("id_card_image", payload.id_card_image);
        data = formData;
      } else {
        data = payload;
      }

      const response = await Axios({
        url: `/api/v1/writers/${writerId}/`,
        method: "PATCH",
        data,
        headers: hasFile ? { "Content-Type": undefined } : undefined,
      });
      return response.data as IWriterEditData;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static blockWriter = async (writerId: string): Promise<void> => {
    try {
      await Axios({
        url: `/api/v1/writers/${writerId}/block/`,
        method: "POST",
      });
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static unblockWriter = async (writerId: string): Promise<void> => {
    try {
      await Axios({
        url: `/api/v1/writers/${writerId}/unblock/`,
        method: "POST",
      });
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDeviceLocations = async (): Promise<IPOSDeviceLocation[]> => {
    try {
      const response = await Axios({
        url: `/api/v1/writers/devices/locations/`,
        method: "GET",
      });
      return response.data as IPOSDeviceLocation[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static registerWriter = async (
    payload: IRegisterWriterPayload,
  ): Promise<IRegisterWriterResponse> => {
    try {
      const formData = new FormData();
      formData.append("email", payload.email);
      formData.append("first_name", payload.first_name);
      formData.append("last_name", payload.last_name);
      formData.append("phone", payload.phone);
      formData.append("password", payload.password);
      formData.append("supervisor_id", payload.supervisor_id);
      formData.append("date_of_birth", payload.date_of_birth);
      if (payload.location_address) {
        formData.append("location_address", payload.location_address);
      }
      if (payload.photo instanceof File) {
        formData.append("photo", payload.photo);
      }
      if (payload.id_card_image instanceof File) {
        formData.append("id_card_image", payload.id_card_image);
      }

      const response = await Axios({
        url: `/api/v1/writers/register/`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": undefined },
      });
      return response.data as IRegisterWriterResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default WritersService;
