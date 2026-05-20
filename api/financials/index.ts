import Axios from "@/api";
import {
  IBestWorstPerformance,
  IDrawsWinningsDashboard,
  IExecuteReportResponse,
  ILiquidationCard,
  IListReportsResponse,
  INetTopupsCard,
  IRetentionRate,
  IRetentionRateTrend,
  ISalesCard,
  ISettlementsCard,
  ITopUpStatistics,
  IWinningStatistics,
  IWinsCard,
  IWritersAtWorkCard,
} from "@/interfaces/financials.interface";
import { handleApiError } from "@/utils/api_error";

class FinancialsService {
  static fetchDrawsAndWinningsDashboard =
    async (): Promise<IDrawsWinningsDashboard> => {
      try {
        const response = await Axios({
          url: `/api/v1/financials/dashboard/draws-and-winnings/`,
          method: "GET",
        });
        return response.data as IDrawsWinningsDashboard;
      } catch (error) {
        throw handleApiError(error);
      }
    };

  static fetchTopUpStatistics = async (): Promise<ITopUpStatistics> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/topup-statistics/`,
        method: "GET",
      });
      return response.data as ITopUpStatistics;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWinningStatistics = async (): Promise<IWinningStatistics> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/winning-statistics/`,
        method: "GET",
      });
      return response.data as IWinningStatistics;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchBestWorstPerformance = async (): Promise<IBestWorstPerformance> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/best-worst-performance/`,
        method: "GET",
      });
      const raw = response.data as IBestWorstPerformance & {
        data?: IBestWorstPerformance;
      };
      return raw.data ?? raw;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchRetentionRateTrend = async (
    days?: number,
  ): Promise<IRetentionRateTrend> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/retention-rate-trend/`,
        method: "GET",
        params: days != null ? { days } : undefined,
      });
      return response.data as IRetentionRateTrend;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchRetentionRate = async (): Promise<IRetentionRate> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/retention-rate/`,
        method: "GET",
      });
      return response.data as IRetentionRate;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchSalesCard = async (): Promise<ISalesCard> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/sales/`,
        method: "GET",
      });
      return response.data as ISalesCard;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchNetTopupsCard = async (): Promise<INetTopupsCard> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/net-topups/`,
        method: "GET",
      });
      return response.data as INetTopupsCard;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWritersAtWorkCard = async (): Promise<IWritersAtWorkCard> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/writers-at-work/`,
        method: "GET",
      });
      return response.data as IWritersAtWorkCard;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWinsCard = async (): Promise<IWinsCard> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/wins/`,
        method: "GET",
      });
      return response.data as IWinsCard;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchLiquidationCard = async (): Promise<ILiquidationCard> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/liquidation/`,
        method: "GET",
      });
      return response.data as ILiquidationCard;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchSettlementsCard = async (): Promise<ISettlementsCard> => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/dashboard/settlements/`,
        method: "GET",
      });
      return response.data as ISettlementsCard;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchReports = async () => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/reports/`,
        method: "GET",
      });
      const payload = response.data as IListReportsResponse;
      return payload.data ?? [];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static executeReport = async (
    reportId: number,
    filters: Record<string, string | number>,
  ) => {
    try {
      const response = await Axios({
        url: `/api/v1/financials/reports/${reportId}/execute/`,
        method: "POST",
        data: filters,
      });
      const payload = response.data as IExecuteReportResponse;
      return payload;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default FinancialsService;
