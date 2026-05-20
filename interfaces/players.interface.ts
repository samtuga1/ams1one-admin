import type { IPaginatedResults } from "./writers.interface";

export interface IPlayerWallet {
  balance: string;
  total_deposited: string;
  total_won: string;
  total_withdrawn: string;
}

export interface IPlayerListRow {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  joined: string;
  wallet: IPlayerWallet | null;
}

export interface IPlayerStats {
  total_players: number;
  active_today: number;
  tickets_today: number;
  wallet_totals: {
    total_balance: string;
    total_deposited: string;
    total_won: string;
    total_withdrawn: string;
  };
}

export interface IPlayerDetail {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  joined: string;
  wallet: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    balance: string;
    total_deposited: string;
    total_won: string;
    total_withdrawn: string;
    transactions: unknown[];
  } | null;
  ticket_counts: {
    active: number;
    won: number;
    lost: number;
    claimed: number;
    cancelled: number;
    expired: number;
  };
}

export interface IPlayerTicketStake {
  id: string;
  sequence_no: number;
  play_type: { id: string; name: string; code: string };
  numbers: number[];
  stake_amount: string;
  total_amount: string;
  is_winner: boolean;
}

export interface IPlayerTicketRow {
  id: string;
  ticket_no: string;
  game_type: { id: string; name: string; code: string };
  draw_event: { id: string; name: string; event_no: number };
  channel: string;
  player_phone: string;
  status: string;
  stake_count: number;
  total_amount: string;
  win_amount: string | null;
  win_status: string | null;
  win_expires_at: string | null;
  stakes: IPlayerTicketStake[];
  sold_at: string;
}

export interface IPlayerWinRow {
  id: string;
  ticket: string;
  draw_result: string;
  win_amount: string;
  status: string;
  computed_at: string;
  claimed_at: string | null;
  expires_at: string | null;
}

export interface IPlayerTransactionRow {
  id: string;
  tx_type: string;
  amount: string;
  balance_after: string;
  description: string;
  reference_id: string | null;
  created_at: string;
}

export type IPlayerListResponse = IPaginatedResults<IPlayerListRow>;
export type IPlayerTicketsResponse = IPaginatedResults<IPlayerTicketRow>;
export type IPlayerWinsResponse = IPaginatedResults<IPlayerWinRow>;
export type IPlayerTransactionsResponse = IPaginatedResults<IPlayerTransactionRow>;
