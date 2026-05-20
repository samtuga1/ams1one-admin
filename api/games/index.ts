import Axios from "@/api";
import {
  IAutoDrawResult,
  ICreateDrawResultPayload,
  IDrawableEvent,
  IDrawEvent,
  IDrawEventTicketsResponse,
  IDrawsWinningsTableRow,
  IGameType,
  IPendingApprovalsResponse,
} from "@/interfaces/games.interface";
import { IPaginatedResults } from "@/interfaces/writers.interface";
import { handleApiError } from "@/utils/api_error";

export type DrawsWinningsTableParams = {
  game_type?: string;
  status?: string;
  draw_date?: string;
  draw_date__gte?: string;
  draw_date__lte?: string;
  page?: number;
  page_size?: number;
};

class GamesService {
  static fetchGameTypes = async (params?: {
    is_active?: boolean;
    code?: string;
  }): Promise<IGameType[]> => {
    try {
      const response = await Axios({
        url: `/api/v1/games/types/`,
        method: "GET",
        params,
      });
      return response.data as IGameType[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDrawsAndWinningsTable = async (
    params?: DrawsWinningsTableParams,
  ): Promise<IPaginatedResults<IDrawsWinningsTableRow>> => {
    try {
      const response = await Axios({
        url: `/api/v1/games/events/draws-and-winnings/`,
        method: "GET",
        params,
      });
      return response.data as IPaginatedResults<IDrawsWinningsTableRow>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDrawEventTickets = async (
    eventId: string,
    params?: { search?: string; page?: number; page_size?: number },
  ): Promise<IDrawEventTicketsResponse> => {
    try {
      const response = await Axios({
        url: `/api/v1/games/events/${eventId}/tickets/`,
        method: "GET",
        params,
      });
      return response.data as IDrawEventTicketsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDrawEvents = async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    draw_date?: string;
  }): Promise<IPaginatedResults<IDrawEvent>> => {
    try {
      const response = await Axios({
        url: `/api/v1/games/events/`,
        method: "GET",
        params,
      });

      return response.data as IPaginatedResults<IDrawEvent>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static createDrawResult = async (
    eventId: string,
    payload: ICreateDrawResultPayload,
  ): Promise<void> => {
    try {
      await Axios({
        url: `/api/v1/games/events/${eventId}/result/`,
        method: "POST",
        data: payload,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchPendingApprovals =
    async (): Promise<IPendingApprovalsResponse> => {
      try {
        const response = await Axios({
          url: `/api/v1/games/events/pending-approvals/`,
          method: "GET",
        });
        return response.data as IPendingApprovalsResponse;
      } catch (error) {
        throw handleApiError(error);
      }
    };

  static confirmDrawResult = async (confirmUrl: string): Promise<void> => {
    try {
      await Axios({ url: `/api/v1/${confirmUrl}`, method: "POST" });
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static rejectDrawResult = async (
    rejectUrl: string,
    reason?: string,
  ): Promise<void> => {
    try {
      await Axios({
        url: `/api/v1/${rejectUrl}`,
        method: "POST",
        data: reason ? { reason } : undefined,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchDrawableToday = async (): Promise<IDrawableEvent[]> => {
    try {
      const response = await Axios({
        url: `/api/v1/games/events/drawable-today/`,
        method: "GET",
      });
      return response.data as IDrawableEvent[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static autoDraw = async (
    eventId: string,
    drawSize?: number,
  ): Promise<IAutoDrawResult> => {
    try {
      const response = await Axios({
        url: `/api/v1/games/events/${eventId}/auto-draw/`,
        method: "POST",
        data: drawSize != null ? { draw_size: drawSize } : undefined,
      });
      return response.data as IAutoDrawResult;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default GamesService;
