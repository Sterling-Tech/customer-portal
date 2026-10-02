"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import { verifyFund } from "@/app/services/walletService";


type VerificationState =
  | "verifying"
  | "successful"
  | "pending"
  | "failed";

export default function FundCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] =
    useState<VerificationState>("verifying");

  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  const [amount, setAmount] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        /*
         * Flutterwave callback parameters.
         */
        const status = searchParams.get("status");

        const transactionId =
          searchParams.get("transaction_id");

        const txRef =
          searchParams.get("tx_ref");

        /*
         * We stored the reference before sending
         * the customer to Flutterwave.
         */
        const storedReference = sessionStorage.getItem(
          "wallet_funding_reference"
        );

        const storedAmount = sessionStorage.getItem(
          "wallet_funding_amount"
        );

        if (storedAmount) {
          setAmount(storedAmount);
        }

        /*
         * Customer cancelled or payment wasn't
         * successful at the gateway.
         */
        if (status !== "successful") {
          setState("failed");
          setMessage(
            "The payment was not completed."
          );
          return;
        }

        if (!transactionId) {
          setState("failed");
          setMessage(
            "Transaction ID was not returned by the payment gateway."
          );
          return;
        }

        /*
         * Prefer the reference returned by Flutterwave.
         * Fall back to our stored reference.
         */
        const reference =
          txRef || storedReference;

        if (!reference) {
          setState("failed");
          setMessage(
            "Funding reference could not be found."
          );
          return;
        }

        /*
         * Verify the payment with YOUR backend.
         *
         * Your backend will independently check
         * Flutterwave before crediting the wallet.
         */
        const response = await verifyFund({
          reference,
          transaction_id: transactionId,
        });

        console.log(
          "FUNDING VERIFICATION:",
          response
        );

        if (response.status === "successful") {
          setState("successful");

          setMessage(
            "Your wallet has been funded successfully."
          );

          /*
           * Clean up temporary data.
           */
          sessionStorage.removeItem(
            "wallet_funding_reference"
          );

          sessionStorage.removeItem(
            "wallet_funding_amount"
          );

          return;
        }

        if (response.status === "pending") {
          setState("pending");

          setMessage(
            response.detail ||
              "Your payment is still being confirmed."
          );

          return;
        }

        setState("failed");

        setMessage(
          response.detail ||
            "We could not verify this payment."
        );
      } catch (error: any) {
        console.error(
          "PAYMENT VERIFICATION ERROR:",
          error
        );

        setState("failed");

        setMessage(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            "Unable to verify your payment."
        );
      }
    };

    verifyPayment();
  }, [searchParams]);

  /* =========================================================
     ICON
  ========================================================= */

  const renderIcon = () => {
    if (state === "successful") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircleOutlineRoundedIcon
            sx={{ fontSize: 46 }}
          />
        </div>
      );
    }

    if (state === "pending") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
          <HourglassTopRoundedIcon
            sx={{ fontSize: 42 }}
          />
        </div>
      );
    }

    if (state === "failed") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ErrorOutlineRoundedIcon
            sx={{ fontSize: 46 }}
          />
        </div>
      );
    }

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
      </div>
    );
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-gray-200/70 bg-white p-7 text-center shadow-sm sm:p-10">

          {renderIcon()}

          <h1 className="mt-6 text-2xl font-bold text-[#172033] sm:text-3xl">
            {state === "verifying"
              ? "Verifying payment"
              : state === "successful"
              ? "Payment successful"
              : state === "pending"
              ? "Payment pending"
              : "Payment verification failed"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            {message}
          </p>

          {amount && (
            <div className="mt-6 rounded-2xl bg-[#F6F8FC] px-5 py-4">
              <p className="text-sm text-gray-500">
                Funding amount
              </p>

              <p className="mt-1 text-2xl font-bold text-[#172033]">
                ₦
                {Number(amount).toLocaleString(
                  "en-NG",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
          )}

          {state !== "verifying" && (
            <button
              type="button"
              onClick={() =>
                router.push("/customer/wallet/fund")
              }
              className="mt-7 w-full rounded-2xl bg-indigo-500 px-5 py-4 text-base font-bold text-white transition hover:bg-indigo-600"
            >
              Back to wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}