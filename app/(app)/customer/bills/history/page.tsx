

"use client";

import { useEffect, useState } from "react";

import {
  AccountBalanceWalletOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlined,
  ErrorOutlineRounded,
  ExpandMoreRounded,
  ReceiptLongOutlined,
  RefreshRounded,
  SearchOffRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import { Bill, BillsResponse, getBills } from "@/app/services/billsService";



interface BillsProps {
  initialData?: BillsResponse | null;
}

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  valueColor = "text-[#172033]",
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3
            className={`mt-2 truncate text-2xl font-bold tracking-tight sm:text-[26px] ${valueColor}`}
          >
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {subtitle}
      </p>
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
    return "N/A";
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

function formatMonth(month: string, monthName: string, year: number) {
  if (monthName) {
    return `${monthName} ${year}`;
  }

  return `${month} ${year}`;
}

function getStatusClasses(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("paid") ||
    normalized.includes("settled") ||
    normalized.includes("success")
  ) {
    return "bg-green-50 text-green-700";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("process")
  ) {
    return "bg-amber-50 text-amber-700";
  }

  if (
    normalized.includes("overdue") ||
    normalized.includes("unpaid") ||
    normalized.includes("outstanding")
  ) {
    return "bg-red-50 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getBillAmount(bill: Bill) {
  return (
    bill.charge?.total_due ||
    bill.charge?.billed_amount ||
    "0"
  );
}

export default function Bills({ initialData = null }: BillsProps) {
  const [data, setData] = useState<BillsResponse | null>(
    initialData
  );

  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const fetchBills = async (selectedPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBills({
        year: year ? Number(year) : undefined,
        month: month || undefined,
        page: selectedPage,
        page_size: pageSize,
      });

      setData(response);
    } catch (err) {
      console.error("Failed to fetch bills:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your bills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchBills(1);
    }
  }, []);

  const handleFilter = async () => {
    setPage(1);
    await fetchBills(1);
  };

  const handleClearFilter = async () => {
    setYear("");
    setMonth("");
    setPage(1);

    try {
      setLoading(true);
      setError("");

      const response = await getBills({
        page: 1,
        page_size: pageSize,
      });

      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your bills."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchBills(page);
  };

  const handleNextPage = async () => {
    if (!data?.next) return;

    const nextPage = page + 1;

    setPage(nextPage);

    await fetchBills(nextPage);
  };

  const handlePreviousPage = async () => {
    if (!data?.previous || page <= 1) return;

    const previousPage = page - 1;

    setPage(previousPage);

    await fetchBills(previousPage);
  };

  if (loading) {
    return (
      <section className="w-full space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <ErrorOutlineRounded className="mt-0.5 text-red-500" />

          <div className="flex-1">
            <p className="font-semibold text-red-700">
              Unable to load bills
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

  const bills = data?.results ?? [];

  const summary = data?.summary ?? {
    current_due: "0",
    previous_balance: "0",
    last_payment: "0",
    standing_arrears: "0",
    latest_period: null,
    bill_count: 0,
  };

  const hasDue = Number(summary.current_due) > 0;
  const hasArrears = Number(summary.standing_arrears) > 0;

  return (
    <section className="w-full space-y-5">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033] sm:text-2xl">
            My Bills
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View your billing history and current bill summary.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
          title="Refresh bills"
          aria-label="Refresh bills"
        >
          <RefreshRounded sx={{ fontSize: 20 }} />
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Current Due */}
        <SummaryCard
          title="Current Due"
          value={formatCurrency(summary.current_due)}
          subtitle={
            hasDue
              ? "Amount currently due"
              : "Nothing currently due"
          }
          icon={
            <AccountBalanceWalletOutlined
              sx={{ fontSize: 24 }}
            />
          }
          iconBg={
            hasDue
              ? "bg-orange-50"
              : "bg-green-50"
          }
          iconColor={
            hasDue
              ? "text-orange-500"
              : "text-green-500"
          }
          valueColor={
            hasDue
              ? "text-orange-600"
              : "text-green-600"
          }
        />

        {/* Previous Balance */}
        <SummaryCard
          title="Previous Balance"
          value={formatCurrency(summary.previous_balance)}
          subtitle="Balance from previous period"
          icon={
            <ReceiptLongOutlined
              sx={{ fontSize: 24 }}
            />
          }
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
          valueColor="text-indigo-600"
        />

        {/* Last Payment */}
        <SummaryCard
          title="Last Payment"
          value={formatCurrency(summary.last_payment)}
          subtitle="Most recent payment"
          icon={
            <CheckCircleOutlined
              sx={{ fontSize: 24 }}
            />
          }
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          valueColor="text-emerald-600"
        />

        {/* Standing Arrears */}
        <SummaryCard
          title="Standing Arrears"
          value={formatCurrency(summary.standing_arrears)}
          subtitle={
            hasArrears
              ? "Outstanding arrears"
              : "No standing arrears"
          }
          icon={
            <WarningAmberRounded
              sx={{ fontSize: 24 }}
            />
          }
          iconBg={
            hasArrears
              ? "bg-red-50"
              : "bg-green-50"
          }
          iconColor={
            hasArrears
              ? "text-red-500"
              : "text-green-500"
          }
          valueColor={
            hasArrears
              ? "text-red-600"
              : "text-green-600"
          }
        />
      </div>

      {/* =====================================================
          LATEST PERIOD + BILL COUNT
      ===================================================== */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <CalendarMonthOutlined sx={{ fontSize: 18 }} />

          <span>
            Latest period:{" "}
            <strong className="text-gray-800">
              {summary.latest_period || "No billing period"}
            </strong>
          </span>
        </div>

        <span className="hidden text-gray-300 sm:block">•</span>

        <span>
          <strong className="text-gray-800">
            {summary.bill_count}
          </strong>{" "}
          {summary.bill_count === 1 ? "bill" : "bills"}
        </span>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

          {/* Year */}
          <div className="flex-1">
            <label
              htmlFor="bill-year"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Year
            </label>

            <input
              id="bill-year"
              type="number"
              placeholder="e.g. 2026"
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Month */}
          <div className="flex-1">
            <label
              htmlFor="bill-month"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Month
            </label>

            <select
              id="bill-month"
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          {/* Filter */}
          <button
            type="button"
            onClick={handleFilter}
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Apply filter
          </button>

          {/* Clear */}
          {(year || month) && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* =====================================================
          BILL HISTORY
      ===================================================== */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h3 className="text-lg font-bold text-[#172033]">
              Billing history
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Your recent electricity bills
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {data?.count ?? 0} total
          </span>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}
        {bills.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <SearchOffRounded
                className="text-gray-400"
                sx={{ fontSize: 32 }}
              />
            </div>

            <h3 className="text-base font-semibold text-gray-800">
              No bills found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              You currently have no bills available. If you are
              a prepaid customer, your account may not have
              postpaid bills.
            </p>

            {(year || month) && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View all bills
              </button>
            )}
          </div>
        ) : (
          <>
            {/* =============================================
                DESKTOP TABLE
            ============================================= */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Period
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Account
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Consumption
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800">
                          {formatMonth(
                            bill.month,
                            bill.month_name,
                            bill.year
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {bill.bill_type}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {bill.account_number}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {bill.customer_class}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {bill.consumed_kwh || "0"} kWh
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {bill.read_mode || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-800">
                          {formatCurrency(
                            getBillAmount(bill)
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          VAT:{" "}
                          {formatCurrency(
                            bill.charge?.vat || "0"
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            bill.status
                          )}`}
                        >
                          {bill.status || "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(bill.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =============================================
                MOBILE BILL CARDS
            ============================================= */}
            <div className="divide-y divide-gray-100 md:hidden">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-5"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatMonth(
                          bill.month,
                          bill.month_name,
                          bill.year
                        )}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {bill.bill_type}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        bill.status
                      )}`}
                    >
                      {bill.status || "N/A"}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Total due
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {formatCurrency(
                        getBillAmount(bill)
                      )}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Consumption
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {bill.consumed_kwh || "0"} kWh
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        VAT
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatCurrency(
                          bill.charge?.vat || "0"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Tariff
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {bill.tariff_name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Band
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {bill.band || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                    <CalendarMonthOutlined
                      sx={{ fontSize: 16 }}
                    />

                    {formatDate(bill.created_at)}
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 sm:px-6">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-800">
                  {page}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={
                    !data?.previous || page <= 1
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!data?.next}
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ExpandMoreRounded
                    sx={{
                      fontSize: 18,
                      transform: "rotate(-90deg)",
                    }}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </section>
  );
}