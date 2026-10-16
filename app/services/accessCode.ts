import { axiosWithCookies } from "../hooks/axios";

export interface AccessCodePayload {
  visitor_name: string;
  visitor_phone: string;
  duration_minutes: number;
}

export interface AccessCodeResponse {
  id: number;
  code: string;
  visitor_name: string;
  visitor_phone: string;
  status: string;
  expires_at: string;
  created_at: string;
  used_at: string | null;
  revoked_at: string | null;
}

interface AccessCodesListResponse {
  results?: AccessCodeResponse[];
  data?: AccessCodeResponse[];
  count?: number;
}

export const generateAccessCode = (
  payload: AccessCodePayload
) => {
  return axiosWithCookies<AccessCodeResponse>(
    "/customer/me/access-codes/",
    "POST",
    payload
  );
};

export const getAccessCodes = async (): Promise<
  AccessCodeResponse[]
> => {
  const response = await axiosWithCookies<
    AccessCodeResponse[] | AccessCodesListResponse
  >(
    "/customer/me/access-codes/",
    "GET"
  );

  console.log("ACCESS CODES RESPONSE:", response);

  // API returned an array
  if (Array.isArray(response)) {
    return response;
  }

  // API returned { results: [...] }
  if (Array.isArray(response?.results)) {
    return response.results;
  }

  // API returned { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  console.warn(
    "Unexpected access codes response:",
    response
  );

  return [];
};

export const revokeAccessCode = (id: number) => {
  return axiosWithCookies<AccessCodeResponse>(
    "/customer/me/access-codes/revoke/",
    "POST",
    { id }
  );
};

export interface VisitorAccessCodePayload {
    code: string;
}

export interface Host {
    name: string;
    phone_number: string;
    address: string;
}
export interface VisitorAccessCodeResponse {
    code: string;
    visitor_name: string;
    visitor_phone: string;
    expires_at: string;
    used_at: string | null;
    host: Host;
}

export const verifyAccessCode = (
    payload: VisitorAccessCodePayload
) => {
    return axiosWithCookies<VisitorAccessCodeResponse>(
        "/access/gate/verify/",
        "POST",
        payload
    );
};

export const admitVisitor = (
    payload: VisitorAccessCodePayload
) => {
    return axiosWithCookies<VisitorAccessCodeResponse>(
        "/access/gate/admit/",
        "POST",
        payload
    );
};
