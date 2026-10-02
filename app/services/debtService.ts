import { axiosWithCookies } from "../hooks/axios";

export interface PaymentPlan {
  id: number;
  name: string;
  description: string;
  code: string;
  is_active: boolean;
}

export interface Debt {
  id: number;
  bucket: string;
  payment_plan: PaymentPlan;
  rate: string;
  balance: string;
  effective_date: string | null;
  is_suspended: boolean;
  is_settled: boolean;
}

export interface MyDebtSummary {
  total_outstanding: string;
  recovered_to_date: string;
  last_deduction: string;
  debt_count: number;
}

export interface MyDebtResponse {
  summary: MyDebtSummary;
  debts: Debt[];
}

export const getMyDebt = () => {
  return axiosWithCookies<MyDebtResponse>(
    "/customer/me/debt/",
    "GET"
  );
};

export interface DebtPayoffPayload {
  amount: string;
}
export interface DebtPayoffResponse {
  transaction_reference: string;
  status: string;
  transaction_type: string;
  amount: string;
  to_debt: string;
  excess_to_credit: string;
  discount: string,
  settled: boolean,
  remaining_debt: string;
}

export interface DebtSettlementPayload {
  settlement_offer: string;
}
export const payDebt = (payload: DebtPayoffPayload) => {
  return axiosWithCookies<DebtPayoffResponse>(
    "/customer/me/debt/pay/",
    "POST",
    payload
  );
}
export const settleDebt = (payload: DebtSettlementPayload) => {
  return axiosWithCookies<DebtPayoffResponse>(
    "/customer/me/debt/settle/",
    "POST",
    payload
  );
}
export interface Lines {
  debt_id: number;
  bucket: string;
  outstanding: string;
  paid_portion: string;
  waived_portion: string;
}

export interface DebtSettlements {
  reference: string;
  status: "quoted";
  quoted_balance: string;
  settlement_amount: string;
  discount_amount: string;
  quoted_at: string;
  expires_at: string;
  lines: Lines[]
}

export const getDebtSettlementOffer = () => {
  return axiosWithCookies<DebtSettlements[]>(
    "/customer/me/debt/settlements/",
    "GET"
  );
}