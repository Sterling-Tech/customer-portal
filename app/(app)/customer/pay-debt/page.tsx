
"use client";

import { useState } from "react";

import {
  ArrowBack,
  AccountBalanceWalletOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  FlashOn,
  Refresh,
} from "@mui/icons-material";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

import { useRouter } from "next/navigation";

import {
  payDebt,
  type DebtPayoffResponse,
} from "@/app/services/debtService";

const PRESET_AMOUNTS = [
  1000,
  2000,
  5000,
  10000,
  20000,
];

const formatAmount = (value: string | number) => {
  const number = Number(value || 0);

  return number.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export default function ClearArrears() {
  const router = useRouter();

  const [amount, setAmount] = useState("1000");

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  const [paymentError, setPaymentError] = useState("");

  const [confirmationOpen, setConfirmationOpen] =
    useState(false);

  const [transaction, setTransaction] =
    useState<DebtPayoffResponse | null>(null);

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    setAmount(numericValue);
    setPaymentError("");
    setPaymentStatus("idle");
  };

  const handlePayDebt = () => {
    setPaymentError("");

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setPaymentError("Please enter a valid amount.");
      return;
    }

    if (numericAmount < 100) {
      setPaymentError("Minimum payment amount is ₦100.");
      return;
    }

    setConfirmationOpen(true);
  };

  const handleConfirmPayment = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setPaymentError("Please enter a valid amount.");
      return;
    }

    try {
      setPaymentError("");
      setPaymentStatus("processing");

      const response = await payDebt({
        amount: amount,
      });

      console.log("DEBT PAYMENT RESPONSE:", response);

      setTransaction(response);

      setConfirmationOpen(false);

      if (
        response.status === "successful" ||
        response.settled === true
      ) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");

        setPaymentError(
          "Your debt payment could not be completed."
        );
      }
    } catch (error) {
      console.error("Debt payment failed:", error);

      setPaymentStatus("failed");

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Unable to process your arrears payment. Please try again."
      );

      setConfirmationOpen(false);
    }
  };

  const handleNewPayment = () => {
    setAmount("1000");
    setPaymentError("");
    setPaymentStatus("idle");
    setTransaction(null);
  };

  /*
   * =========================================================
   * SUCCESS
   * =========================================================
   */

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
            className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[#1e293b] transition hover:bg-gray-100"
          >
            <ArrowBack fontSize="small" />
          </button>

          <h1 className="text-[16px] font-bold text-[#1e293b]">
            Payment successful
          </h1>
        </header>

        <div className="mx-auto max-w-lg px-4 py-8">
          <section className="rounded-[24px] bg-white p-6 text-center shadow-sm">

            {/* SUCCESS ICON */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircleOutlined
                sx={{ fontSize: 50 }}
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#1e293b]">
              Payment successful
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your arrears payment of{" "}
              <strong>
                ₦{formatAmount(transaction.amount)}
              </strong>{" "}
              has been processed successfully.
            </p>

            {/* PAYMENT BREAKDOWN */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#edf0f5]">

              {/* Amount */}

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">
                  Amount paid
                </span>

                <span className="font-bold text-[#1e293b]">
                  ₦{formatAmount(transaction.amount)}
                </span>
              </div>

              <Divider />

              {/* Debt */}

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">
                  Applied to arrears
                </span>

                <span className="font-bold text-[#1e293b]">
                  ₦{formatAmount(transaction.to_debt)}
                </span>
              </div>

              <Divider />

              {/* Excess */}

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">
                  Excess credit
                </span>

                <span className="font-bold text-green-600">
                  ₦{formatAmount(
                    transaction.excess_to_credit
                  )}
                </span>
              </div>

              <Divider />

              {/* Discount */}

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">
                  Discount
                </span>

                <span className="font-bold text-[#1e293b]">
                  ₦{formatAmount(transaction.discount)}
                </span>
              </div>

              <Divider />

              {/* Remaining Debt */}

              <div className="flex items-center justify-between bg-[#f8fafc] px-4 py-3">
                <span className="text-sm font-medium text-gray-600">
                  Remaining arrears
                </span>

                <span className="font-bold text-[#6175f5]">
                  ₦{formatAmount(
                    transaction.remaining_debt
                  )}
                </span>
              </div>
            </div>

            {/* REFERENCE */}

            <p className="mt-5 text-xs text-gray-400">
              Transaction reference
            </p>

            <p className="mt-1 break-all text-xs font-medium text-gray-600">
              {transaction.transaction_reference}
            </p>

            {/* ACTIONS */}

            <div className="mt-6 space-y-3">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/customer/transactions"
                  )
                }
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#6175f5] text-sm font-semibold text-white transition hover:bg-[#4f63e6]"
              >
                View transactions
              </button>

              <button
                type="button"
                onClick={handleNewPayment}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#1e293b] transition hover:bg-gray-50"
              >
                Make another payment
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * MAIN FORM
   * =========================================================
   */

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
          Clear arrears
        </h1>
      </header>

      <div className="mx-auto w-full max-w-2xl px-3 pb-8 pt-4">

        {/* INFORMATION CARD */}

        <section className="rounded-[20px] border border-[#edf0f5] bg-white p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-orange-50 text-orange-500">
              <AccountBalanceWalletOutlined
                sx={{ fontSize: 22 }}
              />
            </div>

            <div>
              <h2 className="text-[16px] font-bold text-[#1e293b]">
                Pay outstanding arrears
              </h2>

              <p className="mt-1 text-[12px] leading-5 text-gray-500">
                Enter the amount you want to pay toward
                your outstanding electricity debt.
              </p>
            </div>
          </div>
        </section>

        {/* AMOUNT */}

        <section className="mt-3 rounded-[20px] border border-[#edf0f5] bg-white p-4">

          <h3 className="mb-2 text-[14px] font-semibold text-[#1e293b]">
            Payment amount
          </h3>

          <div className="flex h-[55px] items-center gap-2 rounded-[14px] border border-[#edf0f5] bg-[#f7f8fc] px-4">

            <span className="text-[22px] font-bold text-[#64748b]">
              ₦
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={formatAmount(amount)}
              onChange={(event) =>
                handleAmountChange(
                  event.target.value
                )
              }
              placeholder="Enter amount"
              className="w-full bg-transparent text-[22px] font-bold text-[#1e293b] outline-none"
            />
          </div>

          {/* PRESETS */}

          <div className="mt-3 flex flex-wrap gap-2">

            {PRESET_AMOUNTS.map((preset) => {

              const selected =
                Number(amount) === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(String(preset));
                    setPaymentError("");
                    setPaymentStatus("idle");
                  }}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    selected
                      ? "border-[#6175f5] bg-[#6175f5] text-white"
                      : "border-[#edf0f5] bg-white text-[#1e293b] hover:border-[#6175f5]"
                  }`}
                >
                  ₦{formatAmount(preset)}
                </button>
              );
            })}
          </div>

          {/* ERROR */}

          {paymentError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-3 text-xs font-medium text-red-600">

              <ErrorOutlined
                sx={{ fontSize: 16 }}
              />

              <span>{paymentError}</span>
            </div>
          )}

          {/* BUTTON */}

          <button
            type="button"
            onClick={handlePayDebt}
            disabled={
              paymentStatus === "processing"
            }
            className="mt-5 flex h-[51px] w-full items-center justify-center gap-2 rounded-[15px] bg-[#6175f5] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#4f63e6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FlashOn sx={{ fontSize: 20 }} />

            Pay ₦{formatAmount(amount)}
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
            Your payment will be applied to your
            outstanding arrears.
          </p>
        </section>
      </div>

      {/* =====================================================
          CONFIRMATION DIALOG
      ===================================================== */}

      <Dialog
        open={confirmationOpen}
        onClose={() => {
          if (
            paymentStatus !== "processing"
          ) {
            setConfirmationOpen(false);
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
          Confirm arrears payment
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>

          <div className="space-y-4">

            {/* AMOUNT */}

            <div className="rounded-2xl bg-[#f6f7fb] px-4 py-5 text-center">

              <p className="text-[12px] font-medium text-[#718096]">
                Amount to pay
              </p>

              <p className="mt-1 text-[30px] font-bold text-[#1e293b]">
                ₦{formatAmount(amount)}
              </p>
            </div>

            {/* NOTICE */}

            <div className="flex gap-2 rounded-xl bg-orange-50 px-3 py-3">

              <AccountBalanceWalletOutlined
                sx={{
                  fontSize: 18,
                  color: "#f97316",
                }}
              />

              <p className="text-[11px] leading-5 text-[#475569]">
                This amount will be applied toward
                your outstanding electricity arrears.
                Any excess may be credited to your
                account according to the payment
                rules.
              </p>
            </div>

          </div>

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
            disabled={
              paymentStatus === "processing"
            }
            onClick={() =>
              setConfirmationOpen(false)
            }
            sx={{
              height: 46,
              borderRadius: "13px",
              borderColor: "#e2e8f0",
              color: "#475569",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            disabled={
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

