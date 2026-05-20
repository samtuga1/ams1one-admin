export interface ILmcEditPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  photo?: File | null;
}

export interface IAvailableLmcOwner {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  photo: string | null;
}

export interface ILmcOperational {
  snapshot_date: string | null;
  active: number;
  passive: number;
  inactive: number;
  recover: number;
  no_use: number;
  writers_total: number;
  pos_issued: number;
  pos_trading: number;
  pos_recovery: number;
}

export interface ILmcFinancial {
  wallet_balance: number;
  monthly_topups: number;
  monthly_sales: number;
  monthly_commissions: number;
}

export interface ILmcDetailCard {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  photo_url: string | null;
  is_active: boolean;
  operational: ILmcOperational;
  financial: ILmcFinancial;
}

export interface IRegisterLmcPayload {
  owner: string;
  address?: string;
  is_active?: boolean;
}

export interface ILmcRegisterResponse {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  owner: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ILmcOwnerOption {
  id: string;
  code: string;
  address: string;
  is_active: boolean;
  owner_email: string;
  owner_phone: string;
  owner_full_name: string;
  created_at: string;
}

export interface IRegisterLmcOnboardingPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  address?: string;
  photo?: File;
}

export interface ILmcWriterOverviewRow {
  id: string;
  writer_id: number;
  name: string;
  phone: string;
  status: string;
  location_address: string;
  ytd_sales: string;
  ytd_topups: string;
  dot: number;
  created_at: string;
}

export interface ILmcTransactionsParams {
  type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface ILmcTransactionRow {
  created_at: string;
  type: string;
  writer_name: string;
  writer_phone: string | null;
  reference: string | null;
  amount: string;
  is_credit: boolean;
}

export interface ILmcSummaryInfo {
  name: string;
  address: string;
  phone: string;
  pos_issued: number;
  pos_trading: number;
  writers_total: number;
}

export interface ILmcSummaryData {
  ytd_sales: string;
  ytd_topups: string;
  ytd_winnings: string;
  writers_count: number;
  ytd_sales_ratio: number;
  ytd_topups_ratio: number;
  ytd_winnings_ratio: number;
  writers_ratio: number;
}

export interface ILmcSummary {
  supervisor_info: ILmcSummaryInfo;
  summary: ILmcSummaryData;
}
