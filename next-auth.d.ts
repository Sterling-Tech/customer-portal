// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface User {
//     access?: string;
//     refresh?: string;
//     customer?: any;
//   }

//   interface Session {
//     user: User & {
//       access?: string;
//       refresh?: string;
//       customer?: any;
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     access?: string;
//     refresh?: string;
//     customer?: any;
//   }
// }

import "next-auth";

import type { Customer } from "@/services/authService";

declare module "next-auth" {
  interface Session {
    user: {
      access: string;
      customer: Customer;
    } & DefaultSession["user"];
  }

  interface User {
    access: string;
    refresh: string;

    account_number: string;
    meter_number: string;

    customer: Customer;
  }
}