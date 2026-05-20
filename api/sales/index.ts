import Axios from "@/api";
import {
  ITodayClaims,
  IPaginatedDetailedTicketsResponse,
  ITodaySales,
  ITodayWins,
  IWinningEventsResponse,
  IWinnersListResponse,
} from "@/interfaces/sales.interface";
import { handleApiError } from "@/utils/api_error";

export type DetailedTicketsParams = {
  status?: string;
  ticket_no?: string;
  player_phone?: string;
  page?: number;
  page_size?: number;
};

class SalesService {
  static fetchTodaySales = async (): Promise<ITodaySales> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/tickets/today_sales/`,
        method: "GET",
      });
      return response.data as ITodaySales;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDetailedTickets = async (
    params?: DetailedTicketsParams,
  ): Promise<IPaginatedDetailedTicketsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/tickets/detailed-list/`,
        method: "GET",
        params,
      });

      return response.data as IPaginatedDetailedTicketsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchTodayWins = async (): Promise<ITodayWins> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/wins/today-wins/`,
        method: "GET",
      });
      return response.data as ITodayWins;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchTodayClaims = async (): Promise<ITodayClaims> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/wins/today-claims/`,
        method: "GET",
      });
      return response.data as ITodayClaims;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWinningEvents = async (
    date?: string,
  ): Promise<IWinningEventsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/wins/winning-events/`,
        method: "GET",
        params: date ? { date } : undefined,
      });

      return response.data as IWinningEventsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchWinnersList = async (
    date?: string,
  ): Promise<IWinnersListResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/wins/winners-list/`,
        method: "GET",
        params: date ? { date } : undefined,
      });
      return response.data as IWinnersListResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default SalesService;
