"use client";

import { useEffect, useState } from "react";

import {
  AccountBalanceWalletOutlined,
  CalendarTodayOutlined,
  CheckCircleOutlined,
  ReceiptLongOutlined,
  RefreshRounded,
  WarningAmberRounded,
  TrendingDownRounded,
} from "@mui/icons-material";

import {
  getMyDebt,
  MyDebtResponse,
  MyDebtSummary,
  Debt,
} from "@/app/services/debtService";

interface DebtSummaryCardsProps {
  data?: MyDebtResponse | null;
  loading?: boolean;
  onRefresh?: () => void;
}

interface DebtCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  valueColor?: string;
}

function DebtCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  cardBg,
  valueColor = "text-[#172033]",
}: DebtCardProps) {
  return (
    <div
      className={`relative min-h-[145px] overflow-hidden rounded-2xl border border-gray-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2
            className={`mt-2 truncate text-2xl font-bold tracking-tight sm:text-[26px] ${valueColor}`}
          >
            {value}
          </h2>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      {subtitle && (
        <div className="mt-4">
          <span className="text-xs text-gray-500">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="min-h-[145px] animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-7 w-36 rounded bg-gray-200" />
        </div>

        <div className="h-11 w-11 rounded-xl bg-gray-200" />
      </div>

      <div className="mt-5 h-3 w-24 rounded bg-gray-200" />
    </div>
  );
}

function formatCurrency(value: string | number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(numericValue));
}

function formatDate(value: string | null) {
  if (!value) {
    return "No deduction yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function DebtSummaryCards({
  data: externalData,
  loading: externalLoading,
  onRefresh,
}: DebtSummaryCardsProps) {
  const [data, setData] = useState<MyDebtResponse | null>(
    externalData ?? null
  );

  const [loading, setLoading] = useState(
    externalLoading ?? !externalData
  );

  const [error, setError] = useState("");

  const fetchDebt = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyDebt();

      console.log("MY DEBT RESPONSE:", response);

      setData(response);
    } catch (err) {
      console.error("Failed to fetch debt:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load debt information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!externalData) {
      fetchDebt();
    }
  }, [externalData]);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
      return;
    }

    await fetchDebt();
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="w-full">
        <div className="mb-4">
          <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-4 w-52 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </section>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <section className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <WarningAmberRounded className="text-red-500" />

          <div className="flex-1">
            <p className="font-semibold text-red-700">
              Unable to load debt information
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
          >
            <RefreshRounded sx={{ fontSize: 18 }} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  /* ================= SUMMARY ================= */

  const summary: MyDebtSummary = data?.summary ?? {
    total_outstanding: "0",
    recovered_to_date: "0",
    last_deduction: null as unknown as string,
    debt_count: 0,
  };

  const debts: Debt[] = data?.debts ?? [];

  const outstanding = Number(summary.total_outstanding);

  const hasOutstandingDebt =
    Number.isFinite(outstanding) && outstanding > 0;

  /*
   * Only active/non-suspended debts with a positive balance
   * are useful for determining whether there is currently
   * collectible debt.
   */
  const activeDebts = debts.filter(
    (debt) =>
      !debt.is_suspended &&
      !debt.is_settled &&
      Number(debt.balance) > 0
  );

  return (
    <section className="w-full">

      {/* ================= HEADER ================= */}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033]">
            Debt overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your current debt and recovery summary
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
          aria-label="Refresh debt information"
          title="Refresh"
        >
          <RefreshRounded sx={{ fontSize: 20 }} />
        </button>
      </div>

      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL OUTSTANDING */}

        <DebtCard
          title="Total Outstanding"
          value={formatCurrency(summary.total_outstanding)}
          subtitle={
            hasOutstandingDebt
              ? "Currently outstanding"
              : "No outstanding debt"
          }
          icon={
            <AccountBalanceWalletOutlined
              sx={{ fontSize: 24 }}
            />
          }
          iconBg={
            hasOutstandingDebt
              ? "bg-orange-50"
              : "bg-green-50"
          }
          iconColor={
            hasOutstandingDebt
              ? "text-orange-500"
              : "text-green-500"
          }
          cardBg={
            hasOutstandingDebt
              ? "bg-gradient-to-br from-orange-50/70 to-white"
              : "bg-gradient-to-br from-green-50/70 to-white"
          }
          valueColor={
            hasOutstandingDebt
              ? "text-orange-600"
              : "text-green-600"
          }
        />

        {/* RECOVERED */}

        <DebtCard
          title="Recovered to Date"
          value={formatCurrency(summary.recovered_to_date)}
          subtitle="Total amount recovered"
          icon={
            <CheckCircleOutlined
              sx={{ fontSize: 24 }}
            />
          }
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          cardBg="bg-gradient-to-br from-emerald-50/70 to-white"
          valueColor="text-emerald-600"
        />

        {/* LAST DEDUCTION */}

        <DebtCard
          title="Last Deduction"
          value={formatDate(summary.last_deduction)}
          subtitle={
            summary.last_deduction
              ? "Most recent recovery"
              : "No deduction recorded"
          }
          icon={
            <CalendarTodayOutlined
              sx={{ fontSize: 23 }}
            />
          }
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          cardBg="bg-gradient-to-br from-blue-50/70 to-white"
          valueColor="text-blue-600"
        />

        {/* DEBT COUNT */}

        <DebtCard
          title="Debt Records"
          value={String(summary.debt_count)}
          subtitle={
            activeDebts.length > 0
              ? `${activeDebts.length} active collectible debt${
                  activeDebts.length === 1 ? "" : "s"
                }`
              : "No active collectible debt"
          }
          icon={
            <ReceiptLongOutlined
              sx={{ fontSize: 24 }}
            />
          }
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
          cardBg="bg-gradient-to-br from-indigo-50/70 to-white"
          valueColor="text-indigo-600"
        />
      </div>

      {/* ================= OPTIONAL ACTIVE DEBT NOTICE ================= */}

      {activeDebts.length > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
          <TrendingDownRounded className="text-orange-500" />

          <div>
            <p className="text-sm font-semibold text-orange-800">
              Active debt detected
            </p>

            <p className="text-xs text-orange-700">
              You currently have {activeDebts.length} active debt record
              {activeDebts.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}