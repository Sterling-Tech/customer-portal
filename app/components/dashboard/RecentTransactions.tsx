// 'use client'
// import React, { useState } from "react";
// import BoltIcon from "@mui/icons-material/Bolt";
// import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
// import { Replay, Search } from "@mui/icons-material";

// interface Transaction {
//     id: string;
//     title: string;
//     subtitle: string;
//     amount: number;
//     date: string;
// }

// const transactions: Transaction[] = [
//     {
//         id: "1",
//         title: "Token via vendingTES...",
//         subtitle: "Token 2487 4857 5862 6633 ...",
//         amount: -200,
//         date: "Sat, 12 Sept · 20:02",
//     },
//     {
//         id: "2",
//         title: "Token via vendingTES...",
//         subtitle: "Token 8455 7543 6278 3535 ...",
//         amount: -200,
//         date: "Sat, 12 Sept · 20:02",
//     },
//     {
//         id: "3",
//         title: "Token via vendingTES...",
//         subtitle: "Token 8828 7547 5847 3253 ...",
//         amount: -200,
//         date: "Sat, 12 Sept · 20:02",
//     },
//     {
//         id: "4",
//         title: "Token via vendingTES...",
//         subtitle: "Token 1234 5678 9012 3456 ...",
//         amount: -200,
//         date: "Sat, 12 Sept · 20:01",
//     },
//     {
//         id: "5",
//         title: "Token via vendingTES...",
//         subtitle: "Token 9876 5432 1098 7654 ...",
//         amount: -200,
//         date: "Sat, 12 Sept · 20:01",
//     },
// ];

// const RecentTransactions: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<"customer" | "wallet">("customer");

//     return (
//         <div className="mt-6 w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-5">
//                 <div className="flex items-center gap-2">
//                     <BoltIcon className="text-blue-500" sx={{ fontSize: 20 }} />
//                     <h2 className="text-lg font-semibold text-gray-900">
//                         Recent transactions
//                     </h2>
//                 </div>
//                 <button className="text-sm font-medium text-indigo-500 hover:text-blue-600 transition-colors">
//                     See all
//                 </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b border-gray-100 mb-4 gap-16">
//                 <button
//                     onClick={() => setActiveTab("customer")}
//                     className={`flex items-center gap-1.5 px-1 pb-3 mr-6 text-sm font-medium transition-colors relative ${activeTab === "customer"
//                         ? "text-gray-900"
//                         : "text-gray-400 hover:text-gray-600"
//                         }`}
//                 >
//                     <BoltIcon
//                         sx={{ fontSize: 16 }}
//                         className={activeTab === "customer" ? "text-blue-500" : "text-gray-400"}
//                     />
//                     Customer
//                     {activeTab === "customer" && (
//                         <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
//                     )}
//                 </button>

//                 <button
//                     onClick={() => setActiveTab("wallet")}
//                     className={`flex items-center gap-1.5 px-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === "wallet"
//                         ? "text-gray-900"
//                         : "text-gray-400 hover:text-gray-600"
//                         }`}
//                 >
//                     <AccountBalanceWalletOutlinedIcon
//                         sx={{ fontSize: 16 }}
//                         className={activeTab === "wallet" ? "text-blue-500" : "text-gray-400"}
//                     />
//                     Wallet
//                     {activeTab === "wallet" && (
//                         <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
//                     )}
//                 </button>
//             </div>

//             {
//                 activeTab === 'customer' ? (
//                     <div>
//                         {/* Showing count */}
//                         <p className="text-xs text-gray-400 mb-4">Showing 5 of 8559</p>

//                         {/* Transaction list */}
//                         <div className="space-y-4">
//                             {transactions.map((tx) => (
//                                 <div key={tx.id} className="flex items-start gap-3">
//                                     {/* Icon */}
//                                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//                                         <BoltIcon className="text-amber-500" sx={{ fontSize: 20 }} />
//                                     </div>

//                                     {/* Content */}
//                                     <div className="flex-1 min-w-0">
//                                         <div className="flex items-start justify-between gap-2">
//                                             <div className="min-w-0">
//                                                 <p className="text-sm font-medium text-gray-900 truncate">
//                                                     {tx.title}
//                                                 </p>
//                                                 <p className="text-xs text-gray-400 truncate mt-0.5">
//                                                     {tx.subtitle}
//                                                 </p>
//                                             </div>
//                                             <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
//                                                 -₦{Math.abs(tx.amount)}
//                                             </p>
//                                         </div>
//                                         <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="justify-center items-center flex">
//                         <div className="space-y-8">
//                             <div>
//                                 <Search className="text-amber-600" />
//                             </div>
//                             <h2 className="text-black font-bold text-lg">Not Found</h2>
//                             <h2 className="text-black/60">We could not find what you asked for</h2>
//                             <button className="bg-indigo-500 py-3 px-6 rounded-2xl hover:bg-blue-500">
//                                 <Replay /> Try again
//                             </button>
//                         </div>
//                     </div>
//                 )
//             }
//         </div>
//     );
// };

// export default RecentTransactions;

"use client";

import React, { useEffect, useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Replay, Search } from "@mui/icons-material";

import {
    getTransactions,
    Transaction,
} from "@/app/services/transactionService";

const RecentTransactions: React.FC = () => {
    const [activeTab, setActiveTab] =
        useState<"customer" | "wallet">("customer");

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [totalTransactions, setTotalTransactions] = useState(0);

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

    const formatAmount = (amount: string) => {
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
                    className={`relative mr-6 flex items-center gap-1.5 px-1 pb-3 text-sm font-medium transition-colors ${
                        activeTab === "customer"
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
                    className={`relative flex items-center gap-1.5 px-1 pb-3 text-sm font-medium transition-colors ${
                        activeTab === "wallet"
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
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center text-center">
                        <Search className="text-amber-600" />

                        <h2 className="mt-4 text-lg font-bold text-black">
                            Not Found
                        </h2>

                        <p className="mt-1 text-black/60">
                            We could not find what you asked for
                        </p>

                        <button
                            type="button"
                            onClick={loadTransactions}
                            className="mt-5 flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-white transition hover:bg-blue-500"
                        >
                            <Replay />

                            Try again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;