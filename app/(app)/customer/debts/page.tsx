"use client";

import React, { useEffect, useState } from "react";

import {
    AccountBalanceWalletOutlined,
    CalendarTodayOutlined,
    CheckCircleOutlined,
    CreditCardOutlined,
    RefreshRounded,
    ReceiptLongOutlined,
    WarningAmberRounded,
    PauseCircleOutlined,
    PaymentsOutlined,
} from "@mui/icons-material";

import {
    getMyDebt,
    MyDebtResponse,
    Debt,
} from "@/app/services/debtService";

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value: string | number) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₦0.00";
    }

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));
};

const formatDate = (value: string | null) => {
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
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatShortDate = (value: string | null) => {
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
};

const formatRate = (value: string) => {
    const rate = Number(value);

    if (!Number.isFinite(rate)) {
        return value;
    }

    return rate.toFixed(2);
};

/* =========================================================
   SUMMARY CARD
========================================================= */

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    cardBg: string;
    valueColor?: string;
}

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
    iconBg,
    iconColor,
    cardBg,
    valueColor = "text-gray-900",
}: SummaryCardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-gray-100 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500">{title}</p>

                    <h2
                        className={`mt-2 truncate text-2xl font-bold tracking-tight sm:text-[27px] ${valueColor}`}
                    >
                        {value}
                    </h2>

                    <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   LOADING CARD
========================================================= */

function LoadingCard() {
    return (
        <div className="min-h-[150px] animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-8 w-40 rounded bg-gray-200" />
                    <div className="h-3 w-28 rounded bg-gray-200" />
                </div>

                <div className="h-11 w-11 rounded-xl bg-gray-200" />
            </div>
        </div>
    );
}

/* =========================================================
   DEBT STATUS
========================================================= */

function DebtStatus({ debt }: { debt: Debt }) {
    if (debt.is_settled) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircleOutlined sx={{ fontSize: 15 }} />
                Settled
            </span>
        );
    }

    if (debt.is_suspended) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                <PauseCircleOutlined sx={{ fontSize: 15 }} />
                Suspended
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <PaymentsOutlined sx={{ fontSize: 15 }} />
            Active
        </span>
    );
}

/* =========================================================
   DEBT ROW
========================================================= */

function DebtRow({ debt }: { debt: Debt }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                        <ReceiptLongOutlined
                            className="text-orange-500"
                            sx={{ fontSize: 22 }}
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                            {debt.bucket}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            Debt ID: {debt.id}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <DebtStatus debt={debt} />

                            {debt.effective_date && (
                                <span className="text-xs text-gray-400">
                                    Effective {formatShortDate(debt.effective_date)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:min-w-[480px]">
                    <div>
                        <p className="text-xs text-gray-400">Balance</p>

                        <p
                            className={`mt-1 text-sm font-bold ${Number(debt.balance) > 0
                                    ? "text-orange-600"
                                    : "text-gray-900"
                                }`}
                        >
                            {formatCurrency(debt.balance)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">Rate</p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatRate(debt.rate)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">Payment plan</p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                            {debt.payment_plan.name}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                            {debt.payment_plan.code}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DebtPage() {
    const [data, setData] = useState<MyDebtResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    /* =======================================================
       FETCH DEBT
    ======================================================= */

    const fetchDebt = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getMyDebt();

            setData(response);
        } catch (err) {
            console.error("Failed to fetch debt:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load your debt information."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDebt();
    }, []);

    /* =======================================================
       LOADING
    ======================================================= */

    if (loading) {
        return (
            <main className="w-full">
                <div className="mb-6">
                    <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />

                    <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                </div>

                <div className="mt-8 h-64 animate-pulse rounded-2xl bg-gray-200" />
            </main>
        );
    }

    /* =======================================================
       ERROR
    ======================================================= */

    if (error) {
        return (
            <main className="w-full">
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <WarningAmberRounded className="text-red-500" />

                        <div className="flex-1">
                            <h2 className="font-semibold text-red-700">
                                Unable to load debt information
                            </h2>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchDebt(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
                        >
                            <RefreshRounded sx={{ fontSize: 18 }} />

                            Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    /* =======================================================
       DEFAULT DATA
    ======================================================= */

    const summary = data?.summary ?? {
        total_outstanding: "0",
        recovered_to_date: "0",
        last_deduction: "",
        debt_count: 0,
    };

    const debts = data?.debts ?? [];

    const hasOutstandingDebt =
        Number(summary.total_outstanding) > 0;

    /* =======================================================
       PAGE
    ======================================================= */

    return (
        <main className="w-full pb-10">
            {/* ===================================================
          HEADER
      =================================================== */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
                        My Debt
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View your outstanding debt and recovery information
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.href = "/customer/settle-debt"}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600"
                    >
                        <PaymentsOutlined sx={{ fontSize: 19 }} />
                        Settle Debts
                    </button>
                    <button
                        type="button"
                        onClick={() => window.location.href = "/customer/pay-debt"}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600"
                    >
                        <PaymentsOutlined sx={{ fontSize: 19 }} />
                        Payoff my Debts
                    </button>

                    <button
                        type="button"
                        onClick={() => fetchDebt(true)}
                        disabled={refreshing}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshRounded
                            sx={{ fontSize: 19 }}
                            className={refreshing ? "animate-spin" : ""}
                        />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

            <section>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Total Outstanding */}
                    <SummaryCard
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

                    {/* Recovered */}
                    <SummaryCard
                        title="Recovered to Date"
                        value={formatCurrency(summary.recovered_to_date)}
                        subtitle="Total amount recovered"
                        icon={
                            <CheckCircleOutlined sx={{ fontSize: 24 }} />
                        }
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-500"
                        cardBg="bg-gradient-to-br from-emerald-50/70 to-white"
                        valueColor="text-emerald-600"
                    />

                    {/* Last Deduction */}
                    <SummaryCard
                        title="Last Deduction"
                        value={formatDate(summary.last_deduction)}
                        subtitle={
                            summary.last_deduction
                                ? "Most recent recovery"
                                : "No deduction recorded"
                        }
                        icon={
                            <CalendarTodayOutlined sx={{ fontSize: 23 }} />
                        }
                        iconBg="bg-blue-50"
                        iconColor="text-blue-500"
                        cardBg="bg-gradient-to-br from-blue-50/70 to-white"
                        valueColor="text-gray-900"
                    />

                    {/* Debt Count */}
                    <SummaryCard
                        title="Debt Records"
                        value={String(summary.debt_count)}
                        subtitle={
                            summary.debt_count === 1
                                ? "Debt record"
                                : "Debt records"
                        }
                        icon={
                            <CreditCardOutlined sx={{ fontSize: 24 }} />
                        }
                        iconBg="bg-indigo-50"
                        iconColor="text-indigo-500"
                        cardBg="bg-gradient-to-br from-indigo-50/70 to-white"
                        valueColor="text-indigo-600"
                    />
                </div>
            </section>

            {/* ===================================================
          DEBT RECORDS
      =================================================== */}

            <section className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#172033]">
                            Debt records
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Individual debt records associated with your account
                        </p>
                    </div>

                    <span className="hidden rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 sm:inline-flex">
                        {debts.length} records
                    </span>
                </div>

                {/* Empty state */}
                {debts.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                            <CheckCircleOutlined
                                className="text-green-500"
                                sx={{ fontSize: 30 }}
                            />
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            No debt records
                        </h3>

                        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                            There are currently no debt records associated
                            with your account.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {debts.map((debt) => (
                            <DebtRow key={debt.id} debt={debt} />
                        ))}
                    </div>
                )}
            </section>

            {/* ===================================================
          INFORMATION NOTE
      =================================================== */}

            {debts.length > 0 && (
                <div className="mt-6 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <WarningAmberRounded
                        className="mt-0.5 shrink-0 text-blue-500"
                        sx={{ fontSize: 20 }}
                    />

                    <div>
                        <p className="text-sm font-semibold text-blue-800">
                            About your debt records
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                            Your individual debt records can include settled
                            or suspended debts. The Total Outstanding amount
                            shown above comes directly from the debt summary
                            provided by the service.
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}