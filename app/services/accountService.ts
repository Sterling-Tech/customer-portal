import { axiosWithCookies } from "../hooks/axios";
import { CustomerCategory, CustomerClass, MeteringType } from "./authService";

export interface Personal {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    account_number: string;
    meter_number: string;
    account_status: 'active' | 'inactive'
}
export interface Meta {
    customer_category: CustomerCategory;
    customer_class: CustomerClass;
    metering_type: MeteringType;
    tariff: string;
    tariff_rate: string;
    band: string;
    krn: string;
    ti: string;
    sgc: string;
    kct1: string;
    kct2: string;
}
export interface Location {
    address: string;
    district: string;
    feeder: string;
    feeder_33: string | null;
    transformer: string;
    service_center: string;
    service_unit: string | null;
}
export interface Wallet{
    balance:string;
}
export interface AccountResponse {
   personal:Personal;
   meta:Meta;
   location:Location;
   wallet:Wallet;
}

export const getAccountDetails = () => {
  return axiosWithCookies<AccountResponse>(
    "/customer/me/",
    "GET"
  );
};