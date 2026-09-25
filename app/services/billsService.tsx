// import { axiosWithCookies } from "../hooks/axios";

// export interface Charge {
//   month_due: string;
//   billed_amount: string;
//   vat: string;
//   net_arrears: string;
//   total_due: string;
//   previous_balance: string;
//   last_payment: string;
//   total_bill: string;
//   total_paid: string;
// }

// export interface BillsResponse {
//   id: number;
//   month: string;
//   month_name: string;
//   year: number;
//   feeder: string;
//   status: string;
//   account_number: string;
//   customer_class: string;
//   type: "metered" | "unmetered";
//   bill_type: "metered" | "unmetered";
//   tariff_name: string;
//   tariff_rate: string;
//   band: string;
//   previous_read: string;
//   current_read: string;
//   read_value: string;
//   rollover_value: string;
//   stored_value: string;
//   read_mode: string;
//   consumed_kwh: string;
//   average: string;
//   estimated: string;
//   discount: string;
//   charge: Charge;
//   created_at: string;
// }

// /**
//  * The backend documentation mentions a summary block.
//  *
//  * Since the exact summary fields were not included in the
//  * example schema, keep the fields optional for now.
//  */
// export interface BillsSummary {
//   total_due?: string;
//   total_bill?: string;
//   net_arrears?: string;
//   previous_balance?: string;
//   total_paid?: string;
// }

// export interface BillsApiResponse {
//   summary?: BillsSummary;
//   bills: BillsResponse[];
// }

// export interface GetBillsParams {
//   year?: number;
//   month?: string;
//   page?: number;
//   page_size?: number;
// }

// export const getBills = async (
//   params?: GetBillsParams
// ): Promise<BillsApiResponse> => {
//   const searchParams = new URLSearchParams();

//   if (params?.year) {
//     searchParams.set("year", String(params.year));
//   }

//   if (params?.month) {
//     searchParams.set("month", params.month);
//   }

//   if (params?.page) {
//     searchParams.set("page", String(params.page));
//   }

//   if (params?.page_size) {
//     searchParams.set("page_size", String(params.page_size));
//   }

//   const query = searchParams.toString();

//   const response = await axiosWithCookies<
//     BillsResponse[] | BillsApiResponse
//   >(
//     `/customer/me/bills/${query ? `?${query}` : ""}`,
//     "GET"
//   );

//   /**
//    * Some versions of the API may return:
//    *
//    * [
//    *   {...}
//    * ]
//    *
//    * while the documented version may return:
//    *
//    * {
//    *   summary: {...},
//    *   bills: [...]
//    * }
//    */

//   if (Array.isArray(response)) {
//     return {
//       bills: response,
//     };
//   }

//   return {
//     summary: response.summary,
//     bills: response.bills ?? [],
//   };
// };

import { axiosWithCookies } from "../hooks/axios";

export interface Charge {
  month_due: string;
  billed_amount: string;
  vat: string;
  net_arrears: string;
  total_due: string;
  previous_balance: string;
  last_payment: string;
  total_bill: string;
  total_paid: string;
}

export interface Bill {
  id: number;
  month: string;
  month_name: string;
  year: number;
  feeder: string;
  status: string;
  account_number: string;
  customer_class: string;
  type: "metered" | "unmetered";
  bill_type: "metered" | "unmetered";
  tariff_name: string;
  tariff_rate: string;
  band: string;
  previous_read: string;
  current_read: string;
  read_value: string;
  rollover_value: string;
  stored_value: string;
  read_mode: string;
  consumed_kwh: string;
  average: string;
  estimated: string;
  discount: string;
  charge: Charge;
  created_at: string;
}

export interface BillsSummary {
  current_due: string;
  previous_balance: string;
  last_payment: string;
  standing_arrears: string;
  latest_period: string | null;
  bill_count: number;
}

export interface BillsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Bill[];
  summary: BillsSummary;
}

export interface BillsParams {
  year?: number;
  month?: string;
  page?: number;
  page_size?: number;
}

// export const getBills = (params?: BillsParams) => {
//   return axiosWithCookies<BillsResponse>(
//     "/customer/me/bills/",
//     "GET",
//     params
//   );
// };
export const getBills = (params?: BillsParams) => {
  const query = new URLSearchParams();

  if (params?.year) {
    query.append("year", String(params.year));
  }

  if (params?.month) {
    query.append("month", params.month);
  }

  if (params?.page) {
    query.append("page", String(params.page));
  }

  if (params?.page_size) {
    query.append("page_size", String(params.page_size));
  }

  const queryString = query.toString();

  return axiosWithCookies<BillsResponse>(
    `/customer/me/bills/${queryString ? `?${queryString}` : ""}`,
    "GET"
  );
};