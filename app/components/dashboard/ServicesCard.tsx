"use client";

import Link from "next/link";

import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const services = [
  {
    title: "E-Token",
    href: "/customer/bills/buy-power",
    icon: ElectricBoltOutlinedIcon,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "Pay Bills",
    href: "/customer/bills",
    icon: ReceiptLongOutlinedIcon,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Fund Wallet",
    href: "/customer/wallet/fund",
    icon: AccountBalanceWalletOutlinedIcon,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Transfer",
    href: "/customer/wallet/transfer",
    icon: SwapHorizRoundedIcon,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

export default function ServicesCard() {
  return (
    <section className="mt-6 w-full rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-indigo-500 sm:h-12 sm:w-12">
            <AppsRoundedIcon sx={{ fontSize: 28 }} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Services
            </h2>

            <p className="mt-1 hidden text-sm text-gray-500 sm:block">
              Access our essential services
            </p>
          </div>
        </div>

        <Link
          href="/customer/services"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800 sm:text-base"
        >
          All

          <ArrowForwardRoundedIcon
            className="transition-transform group-hover:translate-x-1"
            sx={{ fontSize: 19 }}
          />
        </Link>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <Link
              key={service.title}
              href={service.href}
              className="group flex min-w-0 flex-col items-center rounded-2xl border border-transparent px-2 py-4 transition-all duration-200 hover:border-gray-100 hover:bg-gray-50/70 sm:px-3 sm:py-5"
            >
              {/* Icon Box */}
              <div
                className={`flex h-[76px] w-[76px] items-center justify-center rounded-[22px] ${service.bgColor} transition-transform duration-200 group-hover:-translate-y-1 sm:h-[90px] sm:w-[90px]`}
              >
                <Icon
                  className={service.iconColor}
                  sx={{ fontSize: 36 }}
                />
              </div>

              {/* Service Name */}
              <div className="mt-4 flex w-full items-center justify-center gap-1">
                <h3 className="truncate text-center text-sm font-semibold text-gray-800 sm:text-base lg:text-lg">
                  {service.title}
                </h3>
              </div>

              {/* Small Arrow */}
              <div className="mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-blue-100 sm:h-8 sm:w-8">
                <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}