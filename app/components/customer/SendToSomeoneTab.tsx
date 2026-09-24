"use client";

import { useState } from "react";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

interface SendToSomeoneTabProps {
  currency?: string;
  onSubmit?: (data: {
    recipientWalletId: string;
    amount: number;
  }) => Promise<void> | void;
}

const presetAmounts = [1000, 2000, 5000, 10000, 20000];

export default function SendToSomeoneTab({
  currency = "NGN",
  onSubmit,
}: SendToSomeoneTabProps) {
  const [recipientWalletId, setRecipientWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const numericAmount = Number(amount);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  // Handle amount input
  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  // Select a preset amount
  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
    setError("");
  };

  // Validate and submit transfer
  const handleSubmit = async () => {
    setError("");

    if (!recipientWalletId.trim()) {
      setError("Please enter the recipient's wallet ID.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount < 100) {
      setError("Minimum transfer amount is ₦100.");
      return;
    }

    if (!onSubmit) {
      setError("Transfer service is not configured yet.");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        recipientWalletId: recipientWalletId.trim(),
        amount: numericAmount,
      });

      // Clear the form after successful submission
      setRecipientWalletId("");
      setAmount("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send money. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    recipientWalletId.trim().length > 0 &&
    numericAmount >= 100;

  return (
    <div className="space-y-5">
      {/* ================= SEND MONEY FORM ================= */}
      <section className="rounded-[26px] border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
        {/* Recipient Wallet ID */}
        <div className="mb-6">
          <label
            htmlFor="recipient-wallet"
            className="mb-2 block text-sm font-medium text-gray-500 sm:text-base"
          >
            Recipient wallet ID
          </label>

          <div className="flex h-[66px] items-center gap-3 rounded-2xl border border-gray-100 bg-[#F6F8FC] px-4 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
            <PersonOutlineRoundedIcon
              className="shrink-0 text-gray-400"
              sx={{ fontSize: 23 }}
            />

            <input
              id="recipient-wallet"
              type="text"
              value={recipientWalletId}
              onChange={(e) => {
                setRecipientWalletId(e.target.value);
                setError("");
              }}
              placeholder="Enter the wallet ID"
              className="h-full w-full min-w-0 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 sm:text-lg"
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="transfer-amount"
            className="mb-2 block text-sm font-medium text-gray-500 sm:text-base"
          >
            Amount
          </label>

          <div className="flex h-[82px] items-center gap-2 rounded-2xl border border-gray-100 bg-[#F6F8FC] px-4 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 sm:px-5">
            <span className="text-2xl font-semibold text-gray-500 sm:text-3xl">
              {currency === "NGN" ? "₦" : currency}
            </span>

            <input
              id="transfer-amount"
              type="number"
              min="100"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="h-full w-full min-w-0 bg-transparent text-3xl font-bold text-gray-700 outline-none placeholder:text-gray-400 sm:text-4xl"
            />
          </div>
        </div>

        {/* Preset Amounts */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {presetAmounts.map((value) => {
            const selected = numericAmount === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => handlePresetAmount(value)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:text-base ${
                  selected
                    ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {formatCurrency(value)}
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}
      </section>

      {/* ================= HELPER MESSAGE ================= */}
      <div className="flex items-start gap-3 px-1 text-sm text-gray-500 sm:text-base">
        <InfoOutlinedIcon
          className="mt-0.5 shrink-0 text-indigo-400"
          sx={{ fontSize: 19 }}
        />

        <p>
          {recipientWalletId.trim()
            ? `You are sending ${amount ? formatCurrency(numericAmount) : "money"} to wallet ${recipientWalletId}.`
            : "Enter the recipient's wallet ID"}
        </p>
      </div>

      {/* ================= SEND MONEY BUTTON ================= */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-2xl bg-indigo-500 px-5 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-white/70 disabled:shadow-none"
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending...
          </>
        ) : (
          <>
            <SendRoundedIcon sx={{ fontSize: 21 }} />
            Send money
          </>
        )}
      </button>

      {/* ================= RECENT TOP UPS ================= */}
      <section className="overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
          <PaymentsOutlinedIcon
            className="text-indigo-500"
            sx={{ fontSize: 23 }}
          />

          <h2 className="text-lg font-bold text-[#172033] sm:text-xl">
            Recent top ups
          </h2>
        </div>

        {/* Empty State */}
        <div className="flex min-h-[200px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-gray-500">
            <AccountBalanceWalletOutlinedIcon
              sx={{ fontSize: 30 }}
            />
          </div>

          <h3 className="text-base font-semibold text-gray-800">
            No top ups yet
          </h3>

          <p className="mt-1 max-w-xs text-sm text-gray-500">
            Your recent wallet top-ups will appear here once you
            start funding your wallet.
          </p>
        </div>
      </section>
    </div>
  );
}