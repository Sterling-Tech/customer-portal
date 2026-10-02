import { axiosWithCookies } from "../hooks/axios";

/* =========================================================
   FUND WALLET
========================================================= */

export interface FundPayload {
    amount: string;
}

export interface FundResponse {
    reference: string;
    amount: string;
    payment_link: string;
}

export const fundWallet = (payload: FundPayload) => {
    return axiosWithCookies<FundResponse>(
        "/customer/me/wallet/fund/",
        "POST",
        payload
    );
};

/* =========================================================
   VERIFY FUNDING
========================================================= */


export type WalletFundingStatus = | "pending" | "successful" | "abandoned";

export interface WalletHistory {
    reference: string;
    amount: string;
    status: WalletFundingStatus;
    provider: "flutterwave";
    detail: string | null;
    created_at: string;
    completed_at: string | null;
}

export interface VerifyFundingPayload {
    reference: string;
    transaction_id: string;
}

export const verifyFund = (
    payload: VerifyFundingPayload
) => {
    return axiosWithCookies<WalletHistory>(
        "/customer/me/wallet/fund/verify/",
        "POST",
        payload
    );
};


export interface WalletResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: WalletHistory[];
    balance: string;
}

export const walletHistory = () => {
    return axiosWithCookies<WalletResponse>(
        "/customer/me/wallet/",
        "GET"
    );
};