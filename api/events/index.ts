import Axios from "@/api";
import {
  IEvent,
  IEventTicket,
  IIssueTicketsResponse,
  IScanTicketResponse,
  ITicketStatus,
} from "@/interfaces/events.interface";
import { IPaginatedResults } from "@/interfaces/writers.interface";
import { handleApiError } from "@/utils/api_error";

export interface CreateEventPayload {
  name: string;
  event_date: string;
  venue?: string;
  description?: string;
}

class EventsService {
  static fetchEvents = async (): Promise<IPaginatedResults<IEvent>> => {
    try {
      const res = await Axios({ url: "/api/v1/events/", method: "GET" });
      return res.data as IPaginatedResults<IEvent>;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static createEvent = async (payload: CreateEventPayload): Promise<IEvent> => {
    try {
      const res = await Axios({ url: "/api/v1/events/", method: "POST", data: payload });
      return res.data as IEvent;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchEventTickets = async (
    eventId: string,
    params?: { status?: ITicketStatus },
  ): Promise<IEventTicket[]> => {
    try {
      const res = await Axios({
        url: `/api/v1/events/${eventId}/tickets/`,
        method: "GET",
        params,
      });
      return res.data as IEventTicket[];
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static issueTickets = async (
    eventId: string,
    phone_numbers: string[],
  ): Promise<IIssueTicketsResponse> => {
    try {
      const res = await Axios({
        url: `/api/v1/events/${eventId}/issue-tickets/`,
        method: "POST",
        data: { phone_numbers },
      });
      return res.data as IIssueTicketsResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static sendTickets = async (
    eventId: string,
    payload: { ticket_ids: string[] } | { all_undelivered: true },
  ): Promise<{ queued: number }> => {
    try {
      const res = await Axios({
        url: `/api/v1/events/${eventId}/send/`,
        method: "POST",
        data: payload,
      });
      return res.data as { queued: number };
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static scanTicket = async (token: string): Promise<IScanTicketResponse> => {
    try {
      const res = await Axios({
        url: "/api/v1/events/scan/",
        method: "POST",
        data: { token },
      });
      return res.data as IScanTicketResponse;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default EventsService;
