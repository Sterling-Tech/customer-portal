"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import CloseIcon from "@mui/icons-material/Close";
import { WorkHistoryOutlined } from "@mui/icons-material";

const menuItems = [
  {
    name: "Dashboard",
    href: "/customer/dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    name: "My Account",
    href: "/customer/account",
    icon: <AccountCircleOutlinedIcon />,
  },
  {
    name: "Bills & Payments",
    href: "/customer/bills",
    icon: <PaymentsOutlinedIcon />,
  },
  {
    name: "Transactions",
    href: "/customer/transactions",
    icon: <HistoryOutlinedIcon />,
  },
  {
    name: "Debts",
    href: "/customer/debts",
    // icon: <HistoryOutlinedIcon />,
    icon: <WorkHistoryOutlined />,
  },
  {
    name: "My Bills",
    href: "/customer/bills/history",
    icon: <ReceiptLongOutlinedIcon />,
  },
  {
    name: "Support",
    href: "/customer/support",
    icon: <SupportAgentOutlinedIcon />,
  },
  {
    name: "Settings",
    href: "/customer/settings",
    icon: <SettingsOutlinedIcon />,
  },
];

interface CustomerSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomerSidebar({ open, onClose }: CustomerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[260px] flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <Link
            href="/customer/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 text-lg font-bold text-white">
              QC
            </div>

            <span className="text-xl font-medium text-gray-900">
              QuickCash
            </span>
          </Link>

          <button
            onClick={onClose}
            className="text-gray-500 lg:hidden"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/customer/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-4 rounded-md px-4 py-3
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-blue-800 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  }
                `}
              >
                <span className="flex items-center">{item.icon}</span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 p-4">
          <p className="text-xs text-gray-500">
            QuickCash Customer Portal
          </p>

          <p className="mt-1 text-xs text-gray-400">
            © {new Date().getFullYear()} QuickCash
          </p>
        </div>
      </aside>
    </>
  );
}