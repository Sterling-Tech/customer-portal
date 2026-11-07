"use client";

import Link from "next/link";

import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Money } from "@mui/icons-material";

const quickActions = [
  {
    title: "Buy power",
    href: "/customer/bills/buypower",
    icon: ElectricBoltRoundedIcon,
    featured: true,
  },
  {
    title: "Fund wallet",
    href: "/customer/wallet/fund",
    icon: AddCircleOutlineRoundedIcon,
    featured: false,
  },
  {
    title: "Transactions",
    href: "/customer/transactions",
    // icon: QrCodeScannerRoundedIcon,
    icon: Money,
    featured: false,
  },
  {
    title: "View bills",
    href: "/customer/bills",
    icon: DescriptionOutlinedIcon,
    featured: false,
  },
];

export default function QuickActions() {
  return (
    <section className="w-full mt-6">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          What would you like to do today?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`
                group relative flex min-h-[100px] flex-col
                justify-between overflow-hidden rounded-[15px]
                border p-4 transition-all duration-200
                hover:-translate-y-1 hover:shadow-lg
                sm:min-h-[100px] sm:p-4
                ${
                  action.featured
                    ? "border-blue-500 bg-[#5865F2] text-white shadow-sm hover:bg-[#4B58E8]"
                    : "border-gray-100 bg-white text-gray-900 shadow-sm hover:border-blue-200"
                }
              `}
            >
              {/* Icon Container */}
              <div
                className={`
                  flex h-10 w-10 items-center justify-center
                  rounded-2xl transition-colors sm:h-12 sm:w-12
                  ${
                    action.featured
                      ? "bg-white/15 text-white"
                      : "bg-[#F0F3FF] text-[#5865F2] group-hover:bg-blue-100"
                  }
                `}
              >
                <Icon sx={{ fontSize: 30 }} />
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between gap-2">
                <h3
                  className={`
                    text-base font-semibold tracking-tight
                    sm:text-lg
                    ${
                      action.featured
                        ? "text-white"
                        : "text-gray-900"
                    }
                  `}
                >
                  {action.title}
                </h3>

                {/* Arrow */}
                <span
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full transition-all duration-200
                    group-hover:translate-x-1
                    ${
                      action.featured
                        ? "bg-white/15 text-white"
                        : "bg-[#F0F3FF] text-[#5865F2]"
                    }
                  `}
                >
                  <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}