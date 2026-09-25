"use client";

import { useState } from "react";
import {
  ArrowBack,
  Add,
  Bolt,
  AccountBalanceWalletOutlined,
  CreditCardOutlined,
  Close,
  FlashOn,
  ErrorOutlined,
  CheckCircleOutlined,
  ElectricMeterOutlined,
} from "@mui/icons-material";

import { useRouter } from "next/navigation";

type PaymentTab = "buy" | "arrears";

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function BuyPower() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<PaymentTab>("buy");

  const [meterNumber, setMeterNumber] = useState("12345678911");

  const [amount, setAmount] = useState("1000");

  const [walletBalance] = useState(0);

  const [checkingMeter, setCheckingMeter] = useState(false);

  const [meterChecked, setMeterChecked] = useState(false);

  const [meterError, setMeterError] = useState(
    "Invalid vendor token."
  );

  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const [paymentError, setPaymentError] = useState(
    "Check the account before paying."
  );

  const [loading, setLoading] = useState(false);

  // =========================
  // CHECK METER / ACCOUNT
  // =========================

  const handleCheckMeter = async () => {
    if (!meterNumber.trim()) {
      setMeterError("Please enter your meter or account number.");
      setMeterChecked(false);
      return;
    }

    try {
      setCheckingMeter(true);
      setMeterError("");
      setMeterChecked(false);

      /*
        TODO: Connect your meter verification API here.

        Example:
        const response = await verifyMeter({
          identifier: meterNumber,
        });

        if (response.data.success) {
          setMeterChecked(true);
        }
      */

      // Demo state — replace with your actual API response.
      await new Promise((resolve) => setTimeout(resolve, 700));

      setMeterError("Invalid vendor token.");
    } catch {
      setMeterError("Unable to verify account. Try again.");
    } finally {
      setCheckingMeter(false);
    }
  };

  // =========================
  // AMOUNT HANDLERS
  // =========================

  const handleAmountChange = (value: string) => {
    // Allow only numbers
    const numericValue = value.replace(/\D/g, "");

    setAmount(numericValue);
    setPaymentError("");
  };

  const formatAmount = (value: string | number) => {
    return Number(value || 0).toLocaleString("en-NG");
  };

  // =========================
  // PAYMENT HANDLER
  // =========================

  const handlePayment = async () => {
    if (!meterChecked) {
      setPaymentError("Check the account before paying.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setPaymentError("Please enter a valid amount.");
      return;
    }

    if (Number(amount) > walletBalance) {
      setPaymentError("Insufficient wallet balance.");
      return;
    }

    try {
      setLoading(true);
      setPaymentError("");

      /*
        TODO: Connect your electricity payment API here.

        Send:
        - meterNumber
        - amount
        - paymentMethod
        - activeTab
      */

    } catch {
      setPaymentError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-[#f6f7fb]">

      {/* =========================
          HEADER
      ========================= */}

      <header className="sticky top-0 z-20 flex h-[54px] items-center justify-center border-b border-gray-100 bg-white px-4">

        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[#1e293b] transition hover:bg-gray-100"
        >
          <ArrowBack fontSize="small" />
        </button>
        {activeTab === "buy" ? (
          <h1 className="text-[16px] font-bold text-[#1e293b]">
            Pay electricity
          </h1>
        ) : (
          <h1 className="text-[16px] font-bold text-[#1e293b]">
            Clear arrears
          </h1>
        )}
      </header>

      {/* =========================
          CONTENT
      ========================= */}

      {/* <div className="mx-auto w-full max-w-[520px] space-y-3 px-3 pb-6 pt-3"> */}
      <div className="mx-auto w-full  space-y-3 px-3 pb-6 pt-3">

        {/* =========================
            WALLET BALANCE CARD
        ========================= */}

        <section className="flex min-h-[84px] items-center justify-between gap-3 rounded-[18px] border border-[#edf0f5] bg-white px-3 py-3">

          <div className="flex min-w-0 items-center gap-3">

            {/* Wallet Icon */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#eef0ff] text-[#6376f5]">

              <AccountBalanceWalletOutlined
                sx={{ fontSize: 25 }}
              />

            </div>

            {/* Balance */}

            <div className="min-w-0">

              <p className="truncate text-[12px] font-medium text-[#718096]">
                Wallet balance · Test
              </p>

              <h2 className="mt-1 text-[21px] font-bold leading-6 text-[#1e293b]">
                ₦{formatAmount(walletBalance)}
              </h2>

            </div>

          </div>

          {/* Top Up */}

          <button
            type="button"
            onClick={() => router.push("/wallet/top-up")}
            className="flex h-10 shrink-0 items-center justify-center gap-1 rounded-[13px] bg-[#6175f5] px-3 text-[12px] font-semibold text-white transition hover:bg-[#4f63e6]"
          >
            <Add sx={{ fontSize: 16 }} />

            Top up
          </button>

        </section>

        {/* =========================
            PAYMENT TABS
        ========================= */}

        <section className="flex h-[58px] items-center gap-1 rounded-[15px] bg-[#edf0f8] p-2">

          <button
            type="button"
            onClick={() => {
              setActiveTab("buy");
              setPaymentError("");
            }}
            className={`flex h-full flex-1 items-center justify-center rounded-[12px] text-[12px] font-semibold transition ${activeTab === "buy"
              ? "bg-white text-[#6175f5] shadow-sm"
              : "text-[#718096] hover:text-[#1e293b]"
              }`}
          >
            Buy units / pay bill
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("arrears");
              setPaymentError("");
            }}
            className={`flex h-full flex-1 items-center justify-center rounded-[12px] text-[12px] font-semibold transition ${activeTab === "arrears"
              ? "bg-white text-[#6175f5] shadow-sm"
              : "text-[#718096] hover:text-[#1e293b]"
              }`}
          >
            Clear arrears
          </button>

        </section>

        <>
          <section className="rounded-[19px] border border-[#edf0f5] bg-white px-3.5 py-3">

            <h3 className="mb-2 text-[14px] font-semibold text-[#1e293b]">
              Meter or account number
            </h3>

            <div className="flex items-center gap-2">

              {/* Meter Input */}

              <div className="flex h-[43px] min-w-0 flex-1 items-center gap-2 rounded-[13px] border border-[#edf0f5] bg-[#f7f8fc] px-3">

                <Bolt
                  sx={{
                    fontSize: 18,
                    color: "#8995a8",
                  }}
                />

                <input
                  type="text"
                  value={meterNumber}
                  onChange={(e) => {
                    setMeterNumber(e.target.value);
                    setMeterChecked(false);
                    setMeterError("");
                    setPaymentError("");
                  }}
                  placeholder="Enter meter number"
                  className="w-full min-w-0 bg-transparent text-[14px] font-medium text-[#1e293b] outline-none placeholder:text-gray-400"
                />

              </div>

              {/* Check Button */}

              <button
                type="button"
                onClick={handleCheckMeter}
                disabled={checkingMeter}
                className="flex h-[43px] min-w-[72px] items-center justify-center rounded-[13px] bg-[#6175f5] px-4 text-[13px] font-semibold text-white transition hover:bg-[#4f63e6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingMeter ? "Checking..." : "Check"}
              </button>

            </div>

            {/* Meter Validation */}

            {meterError && (
              <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-[#dc2626]">
                {meterError}
              </p>
            )}

            {meterChecked && (
              <p className="mt-2 flex items-center gap-1 text-[12px] font-medium text-green-600">
                <CheckCircleOutlined sx={{ fontSize: 15 }} />

                Account verified successfully.
              </p>
            )}

          {/* </section>

          <section className="rounded-[19px] border border-[#edf0f5] bg-white px-3.5 py-3"> */}

            <h3 className="mb-2 text-[14px] font-semibold text-[#1e293b] mt-5">
              Amount
            </h3>

            {/* Amount Input */}

            <div className="flex h-[49px] items-center gap-2 rounded-[13px] border border-[#edf0f5] bg-[#f7f8fc] px-3">

              <span className="text-[20px] font-bold text-[#64748b]">
                ₦
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={formatAmount(amount)}
                onChange={(e) =>
                  handleAmountChange(e.target.value)
                }
                placeholder="Enter amount"
                className="w-full min-w-0 bg-transparent text-[20px] font-bold text-[#1e293b] outline-none"
              />

              {/* Clear Amount */}

              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount("")}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#94a3b8] transition hover:text-red-500"
                >
                  <Close
                    sx={{
                      fontSize: 16,
                      backgroundColor: "#e2e8f0",
                      borderRadius: "50%",
                      padding: "2px",
                    }}
                  />
                </button>
              )}

            </div>

            {/* Preset Amounts */}

            <div className="mt-2.5 flex flex-wrap gap-2">

              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = Number(amount) === preset;

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(String(preset));
                      setPaymentError("");
                    }}
                    className={`flex h-[31px] min-w-[55px] items-center justify-center rounded-full border px-3 text-[12px] font-semibold transition ${isSelected
                      ? "border-[#6175f5] bg-[#6175f5] text-white shadow-sm"
                      : "border-[#edf0f5] bg-white text-[#1e293b] hover:border-[#6175f5]"
                      }`}
                  >
                    {formatAmount(preset)}
                  </button>
                );
              })}

            </div>



            <section className="rounded-[16px] bg-white px-3.5 py-2">

              <button
                type="button"
                onClick={() => setPaymentMethod("wallet")}
                className="flex w-full items-center justify-between py-1"
              >

                <div className="flex items-center gap-2">

                  <CreditCardOutlined
                    sx={{
                      fontSize: 19,
                      color: "#6175f5",
                    }}
                  />

                  <span className="text-[13px] font-medium text-[#1e293b]">
                    Pay wallet
                  </span>

                </div>

                <div className="flex items-center gap-2 mt-10">

                  <span className="text-[12px] text-[#64748b]">
                    ₦{formatAmount(walletBalance)}
                  </span>

                </div>

              </button>

            </section>
          </section>
        </>

        {activeTab === "buy" ? (
          <div className="space-y-5">
            {paymentError && (
              <div className="flex items-center gap-1.5 px-0.5 text-[12px] font-medium text-[#dc2626]">

                <ErrorOutlined
                  sx={{
                    fontSize: 14,
                  }}
                />

                <span>{paymentError}</span>

              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="flex h-[51px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#6175f5] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#4f63e6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <span>Processing payment...</span>
              ) : (
                <>
                  <FlashOn sx={{ fontSize: 20 }} />

                  Pay ₦{formatAmount(amount)}
                </>
              )}

            </button>
            <p className="text-black/60 text-center">Prepaid tokens appear here immediately and are sent to the number on the account.</p>
          </div>
        ) : (
          <div className="space-y-5">

            {paymentError && (
              <div className="flex items-center gap-1.5 px-0.5 text-[12px] font-medium text-[#dc2626]">

                <ErrorOutlined
                  sx={{
                    fontSize: 14,
                  }}
                />

                <span>{paymentError}</span>

              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="flex h-[51px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#6175f5] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#4f63e6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <span>Processing payment...</span>
              ) : (
                <>
                  <FlashOn sx={{ fontSize: 20 }} />

                  Pay arrears ₦{formatAmount(amount)}
                </>
              )}

            </button>
            <p className="text-black/60 text-center">Arrears Payments are applied to the oldest outstanding debt first</p>
          </div>
        )}
      </div>
    </main>
  );
}