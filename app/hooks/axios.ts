"use client";

import axios, {
  AxiosRequestConfig,
  Method,
} from "axios";

import { getSession, signOut } from "next-auth/react";

// API BASE URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://188.166.161.13:8065";

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,

  headers: {
    Accept: "application/json",
  },
});

// Attach access token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    const accessToken = session?.user?.access;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      // Avoid redirecting repeatedly if already on login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (
          !currentPath.includes("/login") &&
          !currentPath.includes("/signup")
        ) {
          await signOut({
            callbackUrl: "/login",
          });
        }
      }
    }

    return Promise.reject(error);
  }
);

// Generic JSON request
export const axiosWithCookies = async <T = any>(
  endpoint: string,
  method: Method = "GET",
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    ...config,
    url: endpoint,
    method,
    data,
  });

  return response.data;
};

// Multipart request
export const axiosWithCookiesAndMultipart = async <
  T = any
>(
  endpoint: string,
  method: Method = "POST",
  data?: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    ...config,
    url: endpoint,
    method,
    data,
    headers: {
      ...config?.headers,
      Accept: "application/json",
    },
  });

  return response.data;
};

export default axiosInstance;