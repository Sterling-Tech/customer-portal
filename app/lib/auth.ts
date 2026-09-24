import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

import type { AuthResponse } from "../services/authService";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Customer Login",

      credentials: {
        identifier: {
          label: "Account Number / Meter Number",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;
        

        if (
          typeof identifier !== "string" ||
          typeof password !== "string" ||
          !identifier.trim() ||
          !password
        ) {
          return null;
        }

        try {
          const response = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/customer/auth/login/`,
            {
              identifier: identifier.trim(),
              password,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const { access, refresh, customer } = response.data;

          if (!access || !refresh || !customer) {
            return null;
          }

          return {
            id: String(customer.id),
            name: customer.name,
            account_number: customer.account_number,
            meter_number: customer.meter_number,

            access,
            refresh,
            customer,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data;

            if (
              status === 403 &&
              data?.status === "password_expired"
            ) {
              throw new Error("PASSWORD_EXPIRED");
            }
          }

          console.error("Customer authentication failed");

          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
        token.customer = user.customer;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.access = token.access as string;

        session.user.customer = token.customer as AuthResponse["customer"];
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};