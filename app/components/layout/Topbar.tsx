"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CircularProgress from "@mui/material/CircularProgress";

interface CustomerTopbarProps {
  onMenuClick: () => void;
}

export default function CustomerTopbar({
  onMenuClick,
}: CustomerTopbarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Get authenticated customer session
  const { data: session } = useSession();

  // Customer details from NextAuth session
  const customerName = session?.user?.name || "Customer";

  const firstLetter = customerName.charAt(0).toUpperCase();

  // Logout handler
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setShowProfile(false);

      await signOut({
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center justify-between bg-blue-800 px-4 text-white shadow-md lg:left-[260px] lg:px-8">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 transition hover:bg-blue-700 lg:hidden"
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

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Organization */}
        <button
          type="button"
          className="hidden rounded-full p-2 transition hover:bg-blue-700 sm:block"
          aria-label="Organization"
        >
          <BusinessOutlinedIcon />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-full p-2 transition hover:bg-blue-700"
          aria-label="Notifications"
        >
          <NotificationsNoneOutlinedIcon />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            disabled={loggingOut}
            aria-label="Customer profile menu"
            aria-expanded={showProfile}
            className="flex items-center gap-2 rounded-full transition hover:bg-blue-700"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
              {firstLetter}
            </div>

            <KeyboardArrowDownIcon className="hidden sm:block" />
          </button>

          {/* DROPDOWN MENU */}
          {showProfile && (
            <>
              {/* Click outside to close */}
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setShowProfile(false)}
                className="fixed inset-0 z-10 cursor-default"
              />

              <div className="absolute right-0 top-14 z-20 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 text-sm text-gray-700 shadow-xl">
                {/* Customer Info */}
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate font-semibold text-gray-900">
                    {customerName}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Customer Account
                  </p>
                </div>

                {/* My Account */}
                <Link
                  href="/customer/account"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                >
                  <PersonOutlineRoundedIcon
                    fontSize="small"
                    className="text-gray-500"
                  />

                  My Account
                </Link>

                {/* Settings */}
                <Link
                  href="/customer/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                >
                  <SettingsOutlinedIcon
                    fontSize="small"
                    className="text-gray-500"
                  />

                  Settings
                </Link>

                {/* Logout */}
                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 px-4 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? (
                    <CircularProgress
                      size={18}
                      className="text-red-600"
                    />
                  ) : (
                    <LogoutRoundedIcon fontSize="small" />
                  )}

                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}