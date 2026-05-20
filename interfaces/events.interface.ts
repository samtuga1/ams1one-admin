export interface IEvent {
  id: string;
  name: string;
  venue: string;
  event_date: string;
  description: string;
  is_active: boolean;
  ticket_count: number;
  created_at: string;
  updated_at: string;
}

export type ITicketStatus = "issued" | "delivered" | "scanned" | "revoked";

export interface IEventTicket {
  id: string;
  event: string;
  event_name: string;
  player_phone: string;
  status: ITicketStatus;
  delivered_at: string | null;
  delivered_via: string | null;
  delivery_error: string;
  scanned_at: string | null;
  scanned_by: string | null;
  created_at: string;
}

export interface IIssueTicketsResponse {
  created: number;
  tickets: IEventTicket[];
  invalid_phones: string[];
  queued: number;
}

export interface IScanTicketResponse {
  ticket_id: string;
  event_name: string;
  player_phone: string;
  scanned_at: string;
}
