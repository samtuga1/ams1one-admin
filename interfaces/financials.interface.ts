export interface IPeriodFinancialBlock {
  label: string;
  total: string;
  total_amount: number;
}

export interface ITopUpStatistics {
  ytd: IPeriodFinancialBlock;
  last_week: IPeriodFinancialBlock;
  last_month: IPeriodFinancialBlock;
  last_3_months: IPeriodFinancialBlock;
}

export interface IWinningStatistics {
  ytd: IPeriodFinancialBlock;
  last_week: IPeriodFinancialBlock;
  last_month: IPeriodFinancialBlock;
  last_3_months: IPeriodFinancialBlock;
}

export interface IMonthPerformance {
  month: string;
  performance: string;
  net_profit: number;
  topups: number;
  wins: number;
}

export interface IBestWorstPerformance {
  best_month: IMonthPerformance | null;
  worst_month: IMonthPerformance | null;
}

export interface IRetentionRate {
  gross_sales: number;
  net_income: number;
  retention_amount: number;
  retention_rate: string;
}

export interface IYtdSalesBlock {
  total_sales: string;
  total_sales_amount: number;
  unique_players: number;
  total_tickets: number;
  total_stakes: number;
}

export interface IYtdWinningsBlock {
  total_winnings: string;
  total_winnings_amount: number;
  claimed: string;
  claimed_amount: number;
  unclaimed: string;
  unclaimed_amount: number;
}

export interface IYtdGgrBlock {
  gross_gaming_revenue: string;
  gross_gaming_revenue_amount: number;
  retention_rate: string;
  retention_rate_value: number;
  retention_value: string;
  retention_value_amount: number;
}

export interface IDrawsWinningsDashboard {
  ytd_sales: IYtdSalesBlock;
  ytd_winnings: IYtdWinningsBlock;
  ytd_ggr: IYtdGgrBlock;
}

export interface ISalesCard {
  total_sales: string;
  total_sales_amount: number;
  currency: string;
}

export interface INetTopupsCard {
  gross_topups: string;
  gross_topups_amount: number;
  net_topups: string;
  net_topups_amount: number;
  currency: string;
}

export interface IWritersAtWorkCard {
  active_writers: number;
  total_writers: number;
}

export interface IWinsCard {
  total_wins: string;
  total_wins_amount: number;
  winning_stakes: number;
  currency: string;
}

export interface ILiquidationCard {
  total_liquidation: string;
  total_liquidation_amount: number;
  unclaimed_coupons: string;
  unclaimed_coupons_amount: number;
  currency: string;
}

export interface ISettlementsCard {
  total_settlements: string;
  total_settlements_amount: number;
  claim_wallet_balance: string;
  claim_wallet_balance_amount: number;
  currency: string;
}

export interface IRetentionRateTrendDay {
  day: string;
  retention_rate: number;
}

export interface IRetentionRateTrendMonth {
  month: string;
  retention_rate: number;
}

export interface IRetentionRateTrend {
  ytd_retention_rate: number;
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  days?: IRetentionRateTrendDay[];
  months?: IRetentionRateTrendMonth[];
}

export interface IReportColumnSchema {
  key: string;
  label: string;
  required: boolean;
}

export interface IReportFilterSchema {
  key: string;
  label: string;
  type: "text" | "date" | "number";
  required: boolean;
}

export interface IReportSchema {
  category: string;
  columns: IReportColumnSchema[];
  filters: IReportFilterSchema[];
}

export interface IReportDefinition {
  reportId: number;
  name: string;
  schema: IReportSchema;
}

export interface IListReportsResponse {
  status: boolean;
  message: string;
  data: IReportDefinition[];
}

export interface IExecuteReportResponse {
  status: boolean;
  message: string;
  report_name: string;
  data: Array<Record<string, string | number | null>>;
}
