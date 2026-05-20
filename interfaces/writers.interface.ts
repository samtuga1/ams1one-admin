export interface IWriterContact {
  email: string | null;
  phone: string;
}

export interface IWriterInfo {
  id: string;
  name: string;
  profileImage: string | null;
  online: boolean;
  lastSeen: string;
  contact: IWriterContact;
}

export interface IWriterStatisticRow {
  sales: string;
  total_stakes: string;
  topup: string;
  writer: IWriterInfo;
}

export interface IWriterStatisticsData {
  totalwriterFloat: string;
  totalwriters: string;
  writers: IWriterStatisticRow[];
}

export interface IWriterStatisticsResponse {
  data: IWriterStatisticsData;
}

export interface IAvailableFloat {
  available_float: string;
  available_float_amount: number;
  currency: string;
}

export interface ITodayTopUp {
  date: string;
  total_topup: string;
  total_topup_amount: number;
  topup_count: number;
  currency: string;
}

export interface IFormattedAmountPair {
  formatted: string;
  amount: number;
}

export interface ITop10Writer {
  rank: number;
  writer_id: number;
  writer_name: string;
  photo_url: string | null;
  total_sales: IFormattedAmountPair;
  net_profit: IFormattedAmountPair;
}

export interface IWriterListRow {
  id: string;
  writer_id: number;
  name: string;
  phone: string;
  photo_url: string | null;
  status: string;
  supervisor_name: string | null;
  location_address: string;
  ytd_sales: string;
  ytd_topups: string;
  last_transaction: string | null;
  days_on_task: number;
  created_at: string;
}

export interface IPaginatedResults<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IWriterEditData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo_url: string | null;
  id_card_image_url?: string | null;
  location_address?: string;
  date_of_birth?: string;
  supervisor_id?: string;
}

export interface IWriterEditPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  photo?: File | null;
  id_card_image?: File | null;
  location_address?: string;
  date_of_birth?: string;
  supervisor_id?: string;
}

export interface IWriterProfile {
  id: string;
  writer_id: number;
  name: string;
  phone: string;
  email: string;
  photo_url: string | null;
  id_card_image_url?: string | null;
  status: string;
  supervisor_name: string | null;
  location_address: string;
  date_of_birth: string;
  airtime_balance: string;
  claims_balance: string;
  ytd_sales: string;
  ytd_topups: string;
  ytd_winnings: string;
  month_sales: string;
  month_topups: string;
  last_transaction: string | null;
  days_on_task: number;
  lifetime_avg_sale: string;
  avg_topup: string;
  tier: string;
  created_at: string;
}

export interface IWriterSaleRow {
  id: string;
  ticket_no: string;
  sold_at: string;
  total_amount: string;
  event_no: number;
  event_name: string;
  game: string;
  stake_count: number;
  status: string;
  plays: Array<{ play: string; numbers: string; amount: string }>;
}

export interface IWriterTopupRow {
  id: string;
  created_at: string;
  method: string;
  reference: string;
  amount: string;
  airtime_credited: string;
  notes: string;
}

export interface IWriterWinningRow {
  id: string;
  ticket_no: string;
  event_no: number;
  event_name: string;
  game: string;
  stake_amount: string;
  win_amount: string;
  status: string;
  computed_at: string;
  plays: Array<{ play: string; numbers: string; amount: string }>;
}

export interface IWriterCashoutRow {
  id: string;
  created_at: string;
  mobile_number: string;
  mobile_provider: string;
  reference: string;
  amount: string;
  status: string;
}

export interface IActiveWriterDailyStats {
  totals: {
    total_writers: number;
    active_writers: number;
  };
  download_url?: string;
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  days: Array<{
    day: string;
    total_writers: number;
    active_writers: number;
  }>;
  months?: Array<{
    month: string;
    total_writers: number;
    active_writers: number;
  }>;
}

export interface IPOSDeviceLocation {
  id: string;
  serial_number: string;
  device_type: string;
  status: string;
  latitude: string;
  longitude: string;
  location_accuracy_m: string | null;
  location_reported_at: string;
  writer: {
    id: string;
    writer_id: number;
    name: string;
    phone: string | null;
    status: string;
  };
}

export interface IRegisterWriterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  supervisor_id: string;
  date_of_birth: string;
  location_address?: string;
  photo?: File;
  id_card_image?: File;
}

export interface IRegisterWriterResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    phone: string;
  };
  writer: {
    id: string;
    lmc: string;
    photo: string | null;
    status: string;
    writer_id: number;
    date_of_birth: string;
    location_address: string;
    has_bound_device: boolean;
    created_at: string;
    updated_at: string;
  };
  message: string;
}
