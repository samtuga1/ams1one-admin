import Axios from "@/api";
import { handleApiError } from "@/utils/api_error";
import type {
  IPlayerDetail,
  IPlayerListResponse,
  IPlayerStats,
  IPlayerTicketsResponse,
  IPlayerTransactionsResponse,
  IPlayerWinsResponse,
} from "@/interfaces/players.interface";

export type PlayerGame = "dollar-rush" | "five-ninety";

class PlayersService {
  static fetchPlayerList = async (
    game: PlayerGame,
    params?: { search?: string; page?: number; page_size?: number },
  ): Promise<IPlayerListResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/players/${game}/list/`,
        method: "GET",
        params,
      });
      return response.data as IPlayerListResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchPlayerStats = async (game: PlayerGame): Promise<IPlayerStats> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/players/${game}/stats/`,
        method: "GET",
      });
      return response.data as IPlayerStats;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchPlayerDetail = async (
    game: PlayerGame,
    id: string,
  ): Promise<IPlayerDetail> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/players/${game}/${id}/detail/`,
        method: "GET",
      });
      return response.data as IPlayerDetail;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchPlayerTickets = async (
    game: PlayerGame,
    id: string,
    params?: { status?: string; page?: number; page_size?: number },
  ): Promise<IPlayerTicketsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/players/${game}/${id}/tickets/`,
        method: "GET",
        params,
      });
      return response.data as IPlayerTicketsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchPlayerWins = async (
    game: PlayerGame,
    id: string,
    params?: { status?: string; page?: number; page_size?: number },
  ): Promise<IPlayerWinsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/players/${game}/${id}/wins/`,
        method: "GET",
        params,
      });
      return response.data as IPlayerWinsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchPlayerTransactions = async (
    game: PlayerGame,
    id: string,
    params?: { tx_type?: string; page?: number; page_size?: number },
  ): Promise<IPlayerTransactionsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/sales/players/${game}/${id}/transactions/`,
        method: "GET",
        params,
      });
      return response.data as IPlayerTransactionsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default PlayersService;
