import { axiosWithCookies } from "../hooks/axios";

export interface Vendor {
    id: number;
    email: string;
    business_name: string;
    account_status: "active" | "inactive";
    hierachy: string;
    vendor_type: "external" | "internal";
}

export interface Transaction {
    id: number;
    vendor: Vendor;
    transaction_ref: string;
    token: string;
    amount: string;
    timestamp: string;
}
export interface TransactionsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Transaction[];
}

export const getTransactions = (
    page?: number
): Promise<TransactionsResponse> => {
    const url = page
        ? `/customer/transactions/?page=${page}`
        : "/customer/transactions/";

    return axiosWithCookies<TransactionsResponse>(
        url,
        "GET"
    );
};