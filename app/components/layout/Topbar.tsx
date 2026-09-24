"use client";

import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface CustomerTopbarProps {
  onMenuClick: () => void;
}

export default function CustomerTopbar({ onMenuClick }: CustomerTopbarProps) {
  const [showProfile, setShowProfile] = useState(false);

  // Replace with your authenticated customer's information
  const customerName = "Customer";
  const firstLetter = customerName.charAt(0).toUpperCase();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center justify-between bg-blue-800 px-4 text-white shadow-md lg:left-[260px] lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-blue-700 lg:hidden"
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold sm:text-2xl">
            Customer Portal
          </h1>

          <span className="hidden rounded-full bg-green-400 px-3 py-1 text-xs font-medium text-green-950 sm:inline-flex">
            Customer Mode
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          className="hidden rounded-full p-2 hover:bg-blue-700 sm:block"
          aria-label="Organization"
        >
          <BusinessOutlinedIcon />
        </button>

        <button
          className="relative rounded-full p-2 hover:bg-blue-700"
          aria-label="Notifications"
        >
          <NotificationsNoneOutlinedIcon />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
              {firstLetter}
            </div>

            <KeyboardArrowDownIcon className="hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-48 rounded-lg border border-gray-100 bg-white py-2 text-sm text-gray-700 shadow-lg">
              <div className="border-b px-4 py-2">
                <p className="font-semibold">{customerName}</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>

              <a
                href="/customer/account"
                className="block px-4 py-3 hover:bg-gray-50"
              >
                My Account
              </a>

              <a
                href="/customer/settings"
                className="block px-4 py-3 hover:bg-gray-50"
              >
                Settings
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}