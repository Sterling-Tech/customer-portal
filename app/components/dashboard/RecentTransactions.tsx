"use client";

import React, { useEffect, useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Replay, Search } from "@mui/icons-material";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";

import {
    getTransactions,
    Transaction,
} from "@/app/services/transactionService";
import { walletHistory, WalletHistory } from "@/app/services/walletService";
import { getStatusStyles } from "../customer/FundWallet";

const RecentTransactions: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"customer" | "wallet">("customer");

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [topUps, setTopUps] = useState<WalletHistory[]>([]);

    const [totalTransactions, setTotalTransactions] = useState(0);

    const [historyLoading, setHistoryLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getTransactions();

            console.log("Recent transactions:", response);

            setTransactions(response?.results ?? []);
            setTotalTransactions(response?.count ?? 0);
        } catch (error) {
            console.error(
                "Failed to fetch recent transactions:",
                error
            );

            setTransactions([]);
            setTotalTransactions(0);

            setError(
                "We could not load your recent transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        const loadWallet = async () => {
          try {
            setHistoryLoading(true);
    
            const response = await walletHistory();
    
            console.log("WALLET RESPONSE:", response);
    
            setTopUps(
              Array.isArray(response.results)
                ? response.results
                : []
            );
          } catch (error) {
            console.error(
              "Failed to load wallet:",
              error
            );
    
            // setBalance(0);
            setTopUps([]);
          } finally {
            setHistoryLoading(false);
          }
        };
    
        loadWallet();
      }, []);
    
    const getAmount = (amount: string) => {
        const value = Number(amount);

        return Number.isFinite(value) ? value : 0;
    };

    const formatAmount = (amount: string | number) => {
        const numericAmount = Number(amount);

        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Math.abs(numericAmount));
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);

        return new Intl.DateTimeFormat("en-NG", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    const formatToken = (token: string) => {
        if (!token) {
            return "No token";
        }

        return token.length > 18
            ? `${token.slice(0, 18)}...`
            : token;
    };

    return (
        <div className="mx-auto mt-6 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BoltIcon
                        className="text-blue-500"
                        sx={{ fontSize: 20 }}
                    />

                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent transactions
                    </h2>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium text-indigo-500 transition-colors hover:text-blue-600"
                >
                    See all
                </button>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-16 border-b border-gray-100">
                {/* Customer */}
                <button
                    type="button"
                    onClick={() =>
                        setActiveTab("customer")
                    }
                    className={`relative mr-6 flex items-center gap-1.5 px-1 pb-3 text-sm font-medium transition-colors ${activeTab === "customer"
                            ? "text-gray-900"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <BoltIcon
                        sx={{ fontSize: 16 }}
                        className={
                            activeTab === "customer"
                                ? "text-blue-500"
                                : "text-gray-400"
                        }
                    />

                    Customer

                    {activeTab === "customer" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-500" />
                    )}
                </button>

                {/* Wallet */}
                <button
                    type="button"
                    onClick={() =>
                        setActiveTab("wallet")
                    }
                    className={`relative flex items-center gap-1.5 px-1 pb-3 text-sm font-medium transition-colors ${activeTab === "wallet"
                            ? "text-gray-900"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <AccountBalanceWalletOutlinedIcon
                        sx={{ fontSize: 16 }}
                        className={
                            activeTab === "wallet"
                                ? "text-blue-500"
                                : "text-gray-400"
                        }
                    />

                    Wallet

                    {activeTab === "wallet" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-500" />
                    )}
                </button>
            </div>

            {/* Customer Transactions */}
            {activeTab === "customer" ? (
                <div>
                    {/* Showing count */}
                    <p className="mb-4 text-xs text-gray-400">
                        Showing{" "}
                        <span className="font-medium text-gray-600">
                            {transactions.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-600">
                            {totalTransactions}
                        </span>
                    </p>

                    {/* Loading */}
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="flex animate-pulse items-start gap-3"
                                    >
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />

                                        <div className="flex-1">
                                            <div className="h-4 w-40 rounded bg-gray-200" />

                                            <div className="mt-2 h-3 w-56 rounded bg-gray-100" />

                                            <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : error ? (
                        /* Error */
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                                <Search className="text-red-500" />
                            </div>

                            <h3 className="mt-4 text-base font-semibold text-gray-900">
                                Unable to load transactions
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-gray-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadTransactions}
                                className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                <Replay sx={{ fontSize: 18 }} />

                                Try again
                            </button>
                        </div>
                    ) : transactions.length === 0 ? (
                        /* Empty */
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                <Search className="text-gray-400" />
                            </div>

                            <h3 className="mt-4 text-base font-semibold text-gray-900">
                                No transactions found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                You don't have any transactions yet.
                            </p>
                        </div>
                    ) : (
                        /* Transaction list */
                        <div className="space-y-4">
                            {transactions.map(
                                (transaction) => (
                                    <div
                                        key={
                                            transaction.id
                                        }
                                        className="flex items-start gap-3"
                                    >
                                        {/* Icon */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                                            <BoltIcon
                                                className="text-amber-500"
                                                sx={{
                                                    fontSize: 20,
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-gray-900">
                                                        Token via{" "}
                                                        {transaction
                                                            .vendor
                                                            ?.business_name ??
                                                            "Electricity vending"}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs text-gray-400">
                                                        Token{" "}
                                                        {formatToken(
                                                            transaction.token
                                                        )}
                                                    </p>
                                                </div>

                                                <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    -{" "}
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                                                <span>
                                                    {formatDate(
                                                        transaction.timestamp
                                                    )}
                                                </span>

                                                <span className="hidden sm:inline">
                                                    •
                                                </span>

                                                <span className="truncate">
                                                    Ref:{" "}
                                                    {
                                                        transaction.transaction_ref
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Wallet tab */
               <section className="overflow-hidden rounded-[26px] border border-gray-200/70 bg-white shadow-sm">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">

                        <div className="flex items-center gap-3">
                            <ElectricBoltRoundedIcon
                                className="text-indigo-500"
                                sx={{ fontSize: 22 }}
                            />

                            <div>
                                <h2 className="text-lg font-bold text-[#172033] sm:text-xl">
                                    Recent top ups
                                </h2>

                                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                                    Your wallet funding history
                                </p>
                            </div>
                        </div>

                        {topUps.length > 0 && (
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                {topUps.length}
                            </span>
                        )}
                    </div>

                    {/* Empty state */}
                    {topUps.length === 0 ? (
                        <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">

                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-gray-500">
                                <AccountBalanceWalletOutlinedIcon
                                    sx={{ fontSize: 30 }}
                                />
                            </div>

                            <h3 className="text-base font-semibold text-gray-800">
                                No top ups yet
                            </h3>

                            <p className="mt-1 max-w-xs text-sm text-gray-500">
                                Your wallet funding transactions will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {topUps.map((topUp) => {
                                const amount = getAmount(topUp.amount);

                                const statusStyles =
                                    getStatusStyles(topUp.status);

                                return (
                                    <div
                                        key={topUp.reference}
                                        className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${statusStyles.icon}`}
                                            >
                                                <AddCardOutlinedIcon
                                                    sx={{ fontSize: 21 }}
                                                />
                                            </div>

                                            <div className="min-w-0">

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold text-gray-800">
                                                        Wallet top up
                                                    </p>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles.badge}`}
                                                    >
                                                        {topUp.status}
                                                    </span>
                                                </div>

                                                <p className="mt-1 truncate text-xs text-gray-500">
                                                    Ref: {topUp.reference}
                                                </p>

                                                {topUp.detail && (
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {topUp.detail}
                                                    </p>
                                                )}

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {formatDate(
                                                        topUp.completed_at ||
                                                        topUp.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:block sm:text-right">

                                            <p className="text-lg font-bold text-gray-900">
                                                {formatAmount(amount)}
                                            </p>

                                            <p className="mt-1 text-xs capitalize text-gray-400">
                                                {topUp.provider}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default RecentTransactions;