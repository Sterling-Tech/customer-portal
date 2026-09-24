import { axiosWithCookies } from "../hooks/axios";


// Signup payload
export interface SignupPayload {
  identifier: string;
  email: string;
  password: string;
  confirm_password: string;
}
export interface CustomerCategory {
  id: number;
  name: string;
  description: string;
}
export interface CustomerClass {
  id: number;
  category: CustomerCategory;
  name: string;
  description: string;
}
export interface MeteringType {
  id: number;
  name: string;
  description: string;
}
export interface CustomerWallet {
  balance: number;
}
export interface CustomerExtraInfo {
  address: string;
  district: string;
  feeder: string;
  feeder_33: string | null;
  transformer: string;
  service_center: string;
  service_unit: string | null;
  band: string;
  tariff: string;
  postpaid_arrears: string;
  krn: string;
  ti: string;
  sgc: string;
  kct1: string;
  kct2: string;
}
export interface Customer {
  id: number;
  name: string;
  phone_number: string;
  account_number: string;
  meter_number: string;

  customer_category: CustomerCategory;
  customer_class: CustomerClass;
  metering_type: MeteringType;

  wallet: CustomerWallet;

  extra_info: CustomerExtraInfo;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  customer: Customer;
}

// Register customer
export const signUp = (payload: SignupPayload) => {
  return axiosWithCookies<AuthResponse>(
    "/customer/auth/register/",
    "POST",
    payload
  );
};

export interface LoginPayload{
  identifier: string;
  password: string;
}
export const Login = (payload: LoginPayload) => {
  return axiosWithCookies<AuthResponse>(
    "/customer/auth/login/",
    "POST",
    payload
  );
};