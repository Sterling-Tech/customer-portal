import { axiosWithCookies } from "../hooks/axios";

export interface Quote{
  amount: string;
  bill_type: string;
  wallet_balance: string;
  minimum_vend: string;
  to_debt: string;
  to_energy: string;
  to_reversal: string;
}

export const getQuote = (amount: string) => { 
    return axiosWithCookies<Quote>( 
        `/customer/me/vend/quote/?amount=${encodeURIComponent(amount)}`, 
        "GET" 
    ); 
};

export interface VendResponse{
  transaction_reference: string;
  status: "pending" | "successful" | "failed" | "reversed";
  amount: string;
  debt: string;
  vat: string;
  token: string;
  units: string;
}

export interface VendPayload{
    amount:string;
}

export const vend=(payload:VendPayload)=>{
    return axiosWithCookies<VendResponse>(
        "/customer/me/vend/",
        "POST",
        payload
    )
}

export const getVend = (reference: string) => { 
    return axiosWithCookies<VendResponse>( 
        `/customer/me/vend/${encodeURIComponent(reference)}/`, 
        "GET" 
    ); 
};
