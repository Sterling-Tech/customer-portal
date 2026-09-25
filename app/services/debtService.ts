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