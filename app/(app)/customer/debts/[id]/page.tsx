// import React from 'react'
// import {
//     getMyDebt,
//     MyDebtResponse,
//     Debt,
// } from "@/app/services/debtService";

// export default function SingleDebt({ debt }: { debt: Debt }) {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Debt Details</h1>
//       <div className="bg-white shadow-md rounded p-4">
//         <p><strong>ID:</strong> {debt.id}</p>
//         <p><strong>Amount:</strong> {debt.balance}</p>
//         {/* <p><strong>Status:</strong> {debt.status}</p> */}
//         <p><strong>Rate:</strong> {debt.rate}</p>
//         <p><strong>Due Date:</strong> {debt.effective_date}</p>
//         {/* Add more fields as necessary */}
//       </div>
//     </div>
//   )
// }


"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowBackRounded,
  AccountBalanceWalletOutlined,
  CalendarTodayOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  PaymentsOutlined,
  PauseCircleOutlined,
  ReceiptLongOutlined,
  RefreshRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import {
  getMyDebt,
  MyDebtResponse,
  Debt,
} from "@/app/services/debtService";

const formatCurrency = (value: string | number) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "₦0.00";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatRate = (value: string | number) => {
  const rate = Number(value);
  return Number.isFinite(rate) ? rate.toFixed(2) : String(value ?? "N/A");
};

function DebtStatus({ debt }: { debt: Debt }) {
  if (debt.is_settled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
        <CheckCircleOutlined sx={{ fontSize: 17 }} />
        Settled
      </span>
    );
  }

  if (debt.is_suspended) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700">
        <PauseCircleOutlined sx={{ fontSize: 17 }} />
        Suspended
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
      <PaymentsOutlined sx={{ fontSize: 17 }} />
      Active
    </span>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value ?? "N/A"}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="w-full animate-pulse space-y-6 pb-10">
      <div className="h-7 w-48 rounded bg-gray-200" />
      <div className="h-36 rounded-2xl bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-gray-200" />
        ))}
      </div>
    </main>
  );
}

export default function SingleDebtPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const debtId = String(params.id);

  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDebt = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // Reuse the existing endpoint that returns all customer debts.
      const response: MyDebtResponse = await getMyDebt();

      const debts = Array.isArray(response?.debts)
        ? response.debts
        : [];

      // IDs may be numeric in the API and strings in the route.
      const selectedDebt = debts.find(
        (item) => String(item.id) === debtId
      );

      if (!selectedDebt) {
        setDebt(null);
        return;
      }

      setDebt(selectedDebt);
    } catch (err) {
      console.error("Failed to fetch debt details:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load debt details. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debtId]);

  useEffect(() => {
    void fetchDebt();
  }, [fetchDebt]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <main className="w-full pb-10">
        <Link
          href="/customer/debts"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowBackRounded sx={{ fontSize: 19 }} />
          Back to My Debt
        </Link>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <WarningAmberRounded className="text-red-500" />

          <h2 className="mt-2 font-semibold text-red-700">
            Unable to load debt details
          </h2>

          <p className="mt-1 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void fetchDebt(true)}
            disabled={refreshing}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 disabled:opacity-60"
          >
            <RefreshRounded
              className={refreshing ? "animate-spin" : ""}
              sx={{ fontSize: 18 }}
            />
            {refreshing ? "Retrying..." : "Try again"}
          </button>
        </div>
      </main>
    );
  }

  if (!debt) {
    return (
      <main className="w-full pb-10">
        <Link
          href="/customer/debts"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowBackRounded sx={{ fontSize: 19 }} />
          Back to My Debt
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
          <ReceiptLongOutlined
            sx={{ fontSize: 42 }}
            className="text-gray-400"
          />
          <h1 className="mt-3 text-xl font-bold text-gray-900">
            Debt record not found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This debt could not be found in the debt records returned for your account.
          </p>
          <button
            type="button"
            onClick={() => router.push("/customer/debts")}
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Return to My Debt
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/customer/debts"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
          >
            <ArrowBackRounded sx={{ fontSize: 19 }} />
            Back to My Debt
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
            Debt Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed information for debt record #{debt.id}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchDebt(true)}
          disabled={refreshing}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshRounded
            className={refreshing ? "animate-spin" : ""}
            sx={{ fontSize: 18 }}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Main debt overview */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-indigo-50 via-white to-orange-50 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <AccountBalanceWalletOutlined sx={{ fontSize: 26 }} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Debt category</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {debt.bucket || "Debt record"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Debt ID: {debt.id}
                </p>
                <div className="mt-3">
                  <DebtStatus debt={debt} />
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-gray-500">Outstanding balance</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-orange-600">
                {formatCurrency(debt.balance)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Balance reported by the debt service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Debt information */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-[#172033]">
          Debt information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Debt ID"
            value={debt.id}
            icon={<ReceiptLongOutlined sx={{ fontSize: 18 }} />}
          />

          <DetailItem
            label="Debt category / bucket"
            value={debt.bucket}
          />

          <DetailItem
            label="Current balance"
            value={formatCurrency(debt.balance)}
            icon={<AccountBalanceWalletOutlined sx={{ fontSize: 18 }} />}
          />

          <DetailItem
            label="Rate"
            value={formatRate(debt.rate)}
          />

          <DetailItem
            label="Effective date"
            value={formatDate(debt.effective_date)}
            icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
          />

          <DetailItem
            label="Payment plan"
            value={debt.payment_plan?.name ?? "N/A"}
            icon={<CreditCardOutlined sx={{ fontSize: 18 }} />}
          />

          <DetailItem
            label="Payment plan code"
            value={debt.payment_plan?.code ?? "N/A"}
          />

          <DetailItem
            label="Settlement status"
            value={
              debt.is_settled ? "Settled" : "Not settled"
            }
          />

          <DetailItem
            label="Suspension status"
            value={
              debt.is_suspended ? "Suspended" : "Not suspended"
            }
          />
        </div>
      </section>

      {/* Status information */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <WarningAmberRounded
            className="mt-0.5 shrink-0 text-blue-600"
            sx={{ fontSize: 22 }}
          />

          <div>
            <h2 className="font-semibold text-blue-900">
              About this debt
            </h2>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              The information above comes from your existing debt records.
              {debt.is_settled
                ? " This debt is marked as settled."
                : debt.is_suspended
                  ? " This debt is currently marked as suspended."
                  : " This debt is not marked as settled or suspended."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}