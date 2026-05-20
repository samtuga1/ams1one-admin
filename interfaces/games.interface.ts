import type { IPaginatedResults } from "./writers.interface";

export interface IGameType {
  id: string;
  name: string;
  code: string;
  description: string;
  number_pool: string;
  numbers_drawn: string;
  allow_sunday_stake: boolean;
  sales_open_time: string;
  sales_close_time: string;
  is_active: boolean;
  created_at: string;
}

export interface IDrawsWinningsTableRow {
  event_id: string;
  event_no: number;
  draw_date: string;
  event_name: string;
  draw_time: string;
  pre_draw: string;
  pre_draw_amount: number;
  draw_numbers: number[];
  machine_numbers: number[];
  post_draw_1: string;
  post_draw_1_amount: number;
  post_draw_2: string;
  post_draw_2_amount: number;
  payout_ratio: string;
  payout_ratio_value: number;
  total_winnings: string;
  total_winnings_amount: number;
}

export interface IDrawEventTicketsStake {
  stake_id: string;
  created_at: string;
  game: {
    id: string;
    name: string;
    code: string;
  };
  event_id: string;
  event: string;
  play_group: string;
  play: string;
  numbers: string;
  stake_amount: string;
  original_numbers: string;
  player_phone: string;
  stake_status: string;
  writer: {
    id: string;
    name: string;
    phone: string;
  } | null;
}

export interface IDrawEventTicketRow {
  ticket_id: string;
  ticket_no: string;
  stake_count: number;
  stake_value: string;
  stake_value_amount: number;
  datetime: string;
  staked_by: string;
  phone_number: string;
  status: string;
  stakes: IDrawEventTicketsStake[];
}

export interface IDrawEventTicketsEventHeader {
  event_no: number;
  event_name: string;
  draw_numbers: number[];
  total_wins: string;
  total_wins_amount: number;
  payout_ratio: string;
  payout_ratio_value: number;
  draw_date: string;
  draw_time: string;
}

export interface IDrawEventTicketsResponse {
  event: IDrawEventTicketsEventHeader;
  tickets: IPaginatedResults<IDrawEventTicketRow>;
}

export interface IDrawEvent {
  event_id: string;
  id: string;
  event_no: number;
  event_name: string;
  name: string;
  game_type: { id: string; name: string; code: string } | null;
  game_type_name: string;
  draw_date: string;
  draw_time: string;
  status: string;
}

export interface ICreateDrawResultPayload {
  numbers: number[];
}

export interface IPendingApproval {
  approval_id: string;
  draw_event_id: string;
  event_no: number;
  event_name: string | null;
  game_type: string;
  draw_date: string;
  numbers: number[];
  submitted_by: string;
  submitted_at: string;
  confirm_url: string;
  reject_url: string;
}

export interface IPendingApprovalsResponse {
  count: number;
  pending: IPendingApproval[];
}

export interface IDrawableEvent {
  id: string;
  event_no: number;
  game_type_name: string;
  draw_date: string;
  status: string;
  label: string;
}

export interface IAutoDrawResult {
  draw_result: {
    id: string;
    draw_event: string;
    game_type: {
      id: string;
      name: string;
      code: string;
      number_pool: number;
      numbers_drawn: number;
    };
    numbers: number[];
    machine_numbers: number[] | null;
    pre_draw_sales: string;
    post_draw_sales_1: string;
    post_draw_sales_2: string;
    total_winnings: string;
    payout_ratio: string;
    drawn_at: string;
    processed_at: string | null;
  };
  projected_payout: number;
  total_sales: number;
  house_margin: number;
  ticket_count: number;
}
