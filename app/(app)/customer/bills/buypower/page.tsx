
"use client";

import { useEffect, useState } from "react";

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
  Refresh,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "next/navigation";

import { getAccountDetails } from "@/app/services/accountService";
import {
  getQuote,
  vend,
  getVend,
  type Quote,
  type VendResponse,
} from "@/app/services/vendService";

type PaymentTab = "buy" | "arrears";

type PaymentStatus =
  | "idle"
  | "quoting"
  | "ready"
  | "processing"
  | "success"
  | "failed";

const PRESET_AMOUNTS = [
  1000,
  2000,
  5000,
  10000,
  20000,
];

const POLL_INTERVAL = 2000;
const MAX_POLL_ATTEMPTS = 30;

export default function BuyPower() {
  const router = useRouter();

  const [meterNumber, setMeterNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");

  const [activeTab, setActiveTab] = useState<PaymentTab>("buy");
  const [amount, setAmount] = useState("1000");
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentError, setPaymentError] = useState("");
  const [transaction, setTransaction] = useState<VendResponse | null>(null);

  const [loadingAccount, setLoadingAccount] = useState(true);

  const loadAccount = async () => {
    try {
      setLoadingAccount(true);

      const response = await getAccountDetails();

      setAccountNumber(response.personal.account_number);
      setMeterNumber(response.personal.meter_number);
      setWalletBalance(response.wallet?.balance ?? "0");
    } catch (error) {
      console.error("Account information not found:", error);
    } finally {
      setLoadingAccount(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);


  const formatAmount = (
    value: string | number
  ) => {
    const number = Number(value || 0);
    return number.toLocaleString("en-NG");
  };

  const handleAmountChange = (
    value: string
  ) => {
    const numericValue =
      value.replace(/\D/g, "");

    setAmount(numericValue);
    setQuote(null);
    setQuoteError("");
    setPaymentError("");
    setPaymentStatus("idle");
  };

  const handleGetQuote = async () => {
    setQuoteError("");
    setPaymentError("");
    setQuote(null);

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setQuoteError("Please enter a valid amount.");
      return;
    }

    if (numericAmount < 100) {
      setQuoteError("Minimum payment amount is ₦100.");
      return;
    }

    if (numericAmount > Number(walletBalance)) {
      setQuoteError("Insufficient wallet balance.");
      return;
    }

    try {
      setQuoteLoading(true);
      setPaymentStatus("quoting");

      const response = await getQuote(amount);

      console.log("VEND QUOTE:", response);
      setQuote(response);
      setPaymentStatus("ready");
    } catch (error) {
      console.error("Failed to get vend quote:", error);
      setQuoteError(
        error instanceof Error
          ? error.message
          : "Unable to calculate your payment. Please try again."
      );

      setPaymentStatus("idle");
    } finally {
      setQuoteLoading(false);
    }
  };

  const pollVendStatus = async (
    reference: string
  ) => {
    for (
      let attempt = 0;
      attempt < MAX_POLL_ATTEMPTS;
      attempt++
    ) {
      try {
        const response = await getVend(reference);

        console.log(
          `VEND STATUS ATTEMPT ${attempt + 1}:`,
          response
        );

        setTransaction(response);

        if (response.status === "successful") {
          setPaymentStatus("success");

          // Refresh wallet balance
          await loadAccount();

          return;
        }

        if (
          response.status === "failed" ||
          response.status === "reversed"
        ) {
          setPaymentStatus("failed");

          setPaymentError(
            response.status === "reversed"
              ? "Your payment was reversed and the amount has been returned to your wallet."
              : "Your electricity payment could not be completed. If your wallet was debited, the amount will be returned automatically."
          );

          // Refresh balance because the backend may have
          // returned the money.
          await loadAccount();

          return;
        }

        // Still pending
        await new Promise((resolve) =>
          setTimeout(resolve, POLL_INTERVAL)
        );
      } catch (error) {
        console.error(
          "Error checking vend status:",
          error
        );

        // Don't immediately fail the transaction.
        await new Promise((resolve) =>
          setTimeout(resolve, POLL_INTERVAL)
        );
      }
    }

    // We reached the maximum polling attempts.
    setPaymentStatus("failed");

    setPaymentError(
      "Your payment is still being processed. Please check your transaction history shortly."
    );
  };

  const handlePayment = async () => {
    setPaymentError("");
    setQuoteError("");

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setPaymentError("Please enter a valid amount.");
      return;
    }

    if (numericAmount < 100) {
      setPaymentError("Minimum payment amount is ₦100.");
      return;
    }

    if (numericAmount > Number(walletBalance)) {
      setPaymentError("Insufficient wallet balance.");
      return;
    }

    try {
      setQuoteLoading(true);
      setPaymentStatus("quoting");

      const response = await getQuote(amount);

      console.log("VEND QUOTE:", response);

      setQuote(response);
      // Open confirmation modal.
      // DO NOT call vend() here.
      setQuoteModalOpen(true);

      setPaymentStatus("ready");
    } catch (error) {
      console.error("Failed to get vend quote:", error);

      setQuoteError(
        error instanceof Error
          ? error.message
          : "Unable to calculate your payment. Please try again."
      );

      setPaymentStatus("idle");
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!quote) {
      setPaymentError("Payment quote is unavailable.");
      return;
    }

    try {
      setPaymentError("");
      setPaymentStatus("processing");

      const response = await vend({
        amount,
      });

      console.log("VEND CREATED:", response);

      setTransaction(response);

      // Close confirmation dialog
      setQuoteModalOpen(false);

      // Backend says POST normally returns pending.
      // Poll until successful/failed/reversed.
      await pollVendStatus(
        response.transaction_reference
      );
    } catch (error) {
      console.error("Vend failed:", error);

      setQuoteModalOpen(false);

      setPaymentStatus("failed");

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
    }
  };

  // reset payment
  const handleNewPayment = () => {
    setQuote(null);
    setTransaction(null);
    setPaymentError("");
    setQuoteError("");
    setPaymentStatus("idle");
    setAmount("1000");
  };

  if (loadingAccount) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500" />
      </div>
    );
  }

  if (
    paymentStatus === "success" &&
    transaction
  ) {
    return (
      <main className="min-h-screen bg-[#f6f7fb]">
        <header className="sticky top-0 z-20 flex h-[54px] items-center justify-center border-b border-gray-100 bg-white px-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[#1e293b] hover:bg-gray-100"
          >
            <ArrowBack fontSize="small" />
          </button>

          <h1 className="text-[16px] font-bold text-[#1e293b]">
            Payment successful
          </h1>
        </header>

        <div className="mx-auto max-w-lg px-4 py-8">
          <section className="rounded-[24px] bg-white p-6 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircleOutlined
                sx={{ fontSize: 50 }}
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#1e293b]">
              Payment successful
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your electricity payment of{" "}
              <strong>
                ₦{formatAmount(
                  transaction.amount
                )}
              </strong>{" "}
              was completed successfully.
            </p>

            {transaction.token && (
              <div className="mt-6 rounded-2xl bg-[#f6f7fb] p-4">
                <p className="text-xs font-medium text-gray-500">
                  Electricity token
                </p>

                <p className="mt-2 break-all text-xl font-bold tracking-wide text-[#1e293b]">
                  {transaction.token}
                </p>
              </div>
            )}

            {transaction.units && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <span className="text-sm text-gray-500">
                  Units
                </span>

                <span className="font-bold text-[#1e293b]">
                  {transaction.units}
                </span>
              </div>
            )}

            {transaction.debt && (
              <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <span className="text-sm text-gray-500">
                  Debt paid
                </span>

                <span className="font-bold text-[#1e293b]">
                  ₦{formatAmount(
                    transaction.debt
                  )}
                </span>
              </div>
            )}

            <p className="mt-5 text-xs text-gray-400">
              Reference
            </p>

            <p className="mt-1 break-all text-xs font-medium text-gray-600">
              {transaction.transaction_reference}
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/customer/transactions"
                  )
                }
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#6175f5] text-sm font-semibold text-white hover:bg-[#4f63e6]"
              >
                View transactions
              </button>

              <button
                type="button"
                onClick={handleNewPayment}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#1e293b] hover:bg-gray-50"
              >
                Make another payment
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#f6f7fb]">

      {/* HEADER */}

      <header className="sticky top-0 z-20 flex h-[54px] items-center justify-center border-b border-gray-100 bg-white px-4">

        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[#1e293b] transition hover:bg-gray-100"
        >
          <ArrowBack fontSize="small" />
        </button>

        <h1 className="text-[16px] font-bold text-[#1e293b]">
          {activeTab === "buy"
            ? "Pay electricity"
            : "Clear arrears"}
        </h1>
      </header>

      <div className="mx-auto w-full space-y-3 px-3 pb-6 pt-3">

        {/* WALLET */}

        <section className="flex min-h-[84px] items-center justify-between gap-3 rounded-[18px] border border-[#edf0f5] bg-white px-3 py-3">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#eef0ff] text-[#6376f5]">
              <AccountBalanceWalletOutlined
                sx={{ fontSize: 25 }}
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-[12px] font-medium text-[#718096]">
                Wallet balance
              </p>

              <h2 className="mt-1 text-[21px] font-bold leading-6 text-[#1e293b]">
                ₦{formatAmount(
                  walletBalance
                )}
              </h2>

            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/customer/wallet/fund"
              )
            }
            className="flex h-10 shrink-0 items-center justify-center gap-1 rounded-[13px] bg-[#6175f5] px-3 text-[12px] font-semibold text-white transition hover:bg-[#4f63e6]"
          >
            <Add sx={{ fontSize: 16 }} />
            Top up
          </button>
        </section>

        {/* TABS */}

        <section className="flex h-[58px] items-center gap-1 rounded-[15px] bg-[#edf0f8] p-2">

          <button
            type="button"
            onClick={() => {
              setActiveTab("buy");
              setPaymentError("");
              setQuoteError("");
              setQuote(null);
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
              setQuoteError("");
              setQuote(null);
            }}
            className={`flex h-full flex-1 items-center justify-center rounded-[12px] text-[12px] font-semibold transition ${activeTab === "arrears"
              ? "bg-white text-[#6175f5] shadow-sm"
              : "text-[#718096] hover:text-[#1e293b]"
              }`}
          >
            Clear arrears
          </button>
        </section>

        {/* FORM */}

        <section className="rounded-[19px] border border-[#edf0f5] bg-white px-3.5 py-3">

          <h3 className="mb-2 text-[14px] font-semibold text-[#1e293b]">
            Meter or account number
          </h3>

          <div className="flex h-[43px] min-w-0 items-center gap-2 rounded-[13px] border border-[#edf0f5] bg-[#f7f8fc] px-3">

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
                setMeterNumber(
                  e.target.value
                );
                setPaymentError("");
              }}
              placeholder="Enter meter number"
              className="w-full min-w-0 bg-transparent text-[14px] font-medium text-[#1e293b] outline-none placeholder:text-gray-400"
            />
          </div>

          <h3 className="mb-2 mt-5 text-[14px] font-semibold text-[#1e293b]">
            Amount
          </h3>

          <div className="flex h-[49px] items-center gap-2 rounded-[13px] border border-[#edf0f5] bg-[#f7f8fc] px-3">

            <span className="text-[20px] font-bold text-[#64748b]">
              ₦
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={formatAmount(amount)}
              onChange={(e) =>
                handleAmountChange(
                  e.target.value
                )
              }
              placeholder="Enter amount"
              className="w-full min-w-0 bg-transparent text-[20px] font-bold text-[#1e293b] outline-none"
            />

            {amount && (
              <button
                type="button"
                onClick={() =>
                  handleAmountChange("")
                }
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#94a3b8] hover:text-red-500"
              >
                <Close
                  sx={{
                    fontSize: 16,
                    backgroundColor:
                      "#e2e8f0",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                />
              </button>
            )}
          </div>

          {/* PRESETS */}

          <div className="mt-2.5 flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map(
              (preset) => {
                const isSelected =
                  Number(amount) ===
                  preset;

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(
                        String(preset)
                      );
                      setQuote(null);
                      setPaymentError("");
                      setQuoteError("");
                    }}
                    className={`flex h-[31px] min-w-[55px] items-center justify-center rounded-full border px-3 text-[12px] font-semibold transition ${isSelected
                      ? "border-[#6175f5] bg-[#6175f5] text-white shadow-sm"
                      : "border-[#edf0f5] bg-white text-[#1e293b] hover:border-[#6175f5]"
                      }`}
                  >
                    {formatAmount(
                      preset
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* PAYMENT METHOD */}

          <section className="mt-5 rounded-[16px] bg-white px-3.5 py-2">

            <button
              type="button"
              onClick={() =>
                setPaymentMethod(
                  "wallet"
                )
              }
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

              <span className="text-[12px] text-[#64748b]">
                ₦{formatAmount(
                  walletBalance
                )}
              </span>
            </button>
          </section>

          {/* QUOTE */}

          {quote && (
            <div className="mt-4 rounded-[16px] bg-[#f6f7fb] p-4">

              <div className="mb-3 flex items-center gap-2">
                <ElectricMeterOutlined
                  sx={{
                    fontSize: 19,
                    color: "#6175f5",
                  }}
                />

                <p className="text-[13px] font-bold text-[#1e293b]">
                  Payment breakdown
                </p>
              </div>

              <div className="space-y-2">

                <div className="flex justify-between">
                  <span className="text-[12px] text-gray-500">
                    Amount
                  </span>

                  <span className="text-[13px] font-semibold text-[#1e293b]">
                    ₦{formatAmount(
                      quote.amount
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[12px] text-gray-500">
                    To arrears
                  </span>

                  <span className="text-[13px] font-semibold text-[#1e293b]">
                    ₦{formatAmount(
                      quote.to_debt
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[12px] text-gray-500">
                    To electricity
                  </span>

                  <span className="text-[13px] font-semibold text-[#1e293b]">
                    ₦{formatAmount(
                      quote.to_energy
                    )}
                  </span>
                </div>

                {Number(
                  quote.to_reversal
                ) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">
                        Reversal
                      </span>

                      <span className="text-[13px] font-semibold text-[#1e293b]">
                        ₦{formatAmount(
                          quote.to_reversal
                        )}
                      </span>
                    </div>
                  )}

              </div>
            </div>
          )}

          {/* QUOTE ERROR */}

          {quoteError && (
            <div className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-red-600">
              <ErrorOutlined
                sx={{
                  fontSize: 15,
                }}
              />

              <span>
                {quoteError}
              </span>
            </div>
          )}
        </section>

        {/* PAYMENT ERROR */}

        {paymentError && (
          <div className="flex items-center gap-1.5 px-0.5 text-[12px] font-medium text-[#dc2626]">

            <ErrorOutlined
              sx={{
                fontSize: 14,
              }}
            />

            <span>
              {paymentError}
            </span>
          </div>
        )}

        {/* ACTION */}

        <button
          type="button"
          onClick={handlePayment}
          disabled={
            quoteLoading ||
            paymentStatus ===
            "processing"
          }
          className="flex h-[51px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#6175f5] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#4f63e6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {quoteLoading ||
            paymentStatus ===
            "quoting" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

              Calculating...
            </>
          ) : paymentStatus ===
            "processing" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

              Processing payment...
            </>
          ) : activeTab ===
            "buy" ? (
            <>
              <FlashOn
                sx={{ fontSize: 20 }}
              />

              Pay ₦{formatAmount(
                amount
              )}
            </>
          ) : (
            <>
              <FlashOn
                sx={{ fontSize: 20 }}
              />

              Pay arrears ₦
              {formatAmount(amount)}
            </>
          )}
        </button>

        {/* PROCESSING INFORMATION */}

        {paymentStatus ===
          "processing" && (
            <div className="rounded-[15px] bg-blue-50 px-4 py-3 text-center text-[12px] text-blue-700">
              Your payment has been received.
              We are waiting for the electricity
              provider to complete the transaction.
              Please do not make another payment.
            </div>
          )}

        {/* TRANSACTION REFERENCE */}

        {transaction &&
          paymentStatus ===
          "processing" && (
            <div className="rounded-[15px] border border-gray-100 bg-white px-4 py-3">

              <p className="text-[11px] text-gray-400">
                Transaction reference
              </p>

              <p className="mt-1 break-all text-[12px] font-semibold text-gray-700">
                {
                  transaction.transaction_reference
                }
              </p>
            </div>
          )}

        <p className="text-center text-[11px] text-black/50">
          {activeTab === "buy"
            ? "If you have arrears, part of your payment may first be applied to the outstanding debt."
            : "Arrears payments are applied to outstanding debt first."}
        </p>
      </div>

      {/* quote dialog */}
      <Dialog
        open={quoteModalOpen}
        onClose={() => {
          if (paymentStatus !== "processing") {
            setQuoteModalOpen(false);
            setPaymentStatus("idle");
          }
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "22px",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
            fontSize: "18px",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          Confirm payment
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          {quote && (
            <div className="space-y-4">

              {/* Amount */}
              <div className="rounded-2xl bg-[#f6f7fb] px-4 py-4 text-center">
                <p className="text-[12px] font-medium text-[#718096]">
                  Amount to pay
                </p>

                <p className="mt-1 text-[28px] font-bold text-[#1e293b]">
                  ₦{formatAmount(quote.amount)}
                </p>
              </div>

              {/* Breakdown */}
              <div>
                <p className="mb-3 text-[13px] font-semibold text-[#1e293b]">
                  Payment breakdown
                </p>

                <div className="overflow-hidden rounded-2xl border border-[#edf0f5]">

                  {/* Electricity */}
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
                        <Bolt
                          sx={{
                            fontSize: 19,
                            color: "#eab308",
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-[13px] font-medium text-[#1e293b]">
                          Electricity
                        </p>

                        <p className="text-[11px] text-[#94a3b8]">
                          Energy purchased
                        </p>
                      </div>
                    </div>

                    <p className="text-[13px] font-bold text-[#1e293b]">
                      ₦{formatAmount(quote.to_energy)}
                    </p>
                  </div>

                  <Divider />

                  {/* Arrears */}
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                        <AccountBalanceWalletOutlined
                          sx={{
                            fontSize: 18,
                            color: "#f97316",
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-[13px] font-medium text-[#1e293b]">
                          Arrears
                        </p>

                        <p className="text-[11px] text-[#94a3b8]">
                          Outstanding balance
                        </p>
                      </div>
                    </div>

                    <p className="text-[13px] font-bold text-[#1e293b]">
                      ₦{formatAmount(quote.to_debt)}
                    </p>
                  </div>

                  {/* Reversal */}
                  {Number(quote.to_reversal) !== 0 && (
                    <>
                      <Divider />

                      <div className="flex items-center justify-between px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                            <Refresh
                              sx={{
                                fontSize: 18,
                                color: "#6175f5",
                              }}
                            />
                          </div>

                          <div>
                            <p className="text-[13px] font-medium text-[#1e293b]">
                              Reversal
                            </p>

                            <p className="text-[11px] text-[#94a3b8]">
                              Returned to wallet
                            </p>
                          </div>
                        </div>

                        <p className="text-[13px] font-bold text-[#1e293b]">
                          ₦{formatAmount(quote.to_reversal)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Wallet balance */}
              <div className="flex items-center justify-between rounded-xl bg-[#eef0ff] px-4 py-3">
                <span className="text-[12px] font-medium text-[#64748b]">
                  Wallet balance
                </span>

                <span className="text-[13px] font-bold text-[#1e293b]">
                  ₦{formatAmount(quote.wallet_balance)}
                </span>
              </div>

              {/* Important notice */}
              <div className="flex gap-2 rounded-xl bg-blue-50 px-3 py-3">
                <ErrorOutlined
                  sx={{
                    fontSize: 17,
                    color: "#6175f5",
                    marginTop: "1px",
                  }}
                />

                <p className="text-[11px] leading-5 text-[#475569]">
                  {activeTab === "buy"
                    ? "Please review how your payment will be distributed before confirming."
                    : "Please review the amount that will be applied to your outstanding arrears before confirming."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            gap: 1,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            disabled={paymentStatus === "processing"}
            onClick={() => {
              setQuoteModalOpen(false);
              setPaymentStatus("idle");
            }}
            sx={{
              height: 46,
              borderRadius: "13px",
              borderColor: "#e2e8f0",
              color: "#475569",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#cbd5e1",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            disabled={
              !quote ||
              paymentStatus === "processing"
            }
            onClick={handleConfirmPayment}
            sx={{
              height: 46,
              borderRadius: "13px",
              backgroundColor: "#6175f5",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#4f63e6",
                boxShadow: "none",
              },
            }}
          >
            {paymentStatus === "processing" ? (
              <span className="flex items-center gap-2">
                <CircularProgress
                  size={17}
                  sx={{ color: "white" }}
                />

                Processing...
              </span>
            ) : (
              "Confirm payment"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

