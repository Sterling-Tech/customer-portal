'use client'
import React, { useState } from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Replay, Search } from "@mui/icons-material";

interface Transaction {
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    date: string;
}

const transactions: Transaction[] = [
    {
        id: "1",
        title: "Token via vendingTES...",
        subtitle: "Token 2487 4857 5862 6633 ...",
        amount: -200,
        date: "Sat, 12 Sept · 20:02",
    },
    {
        id: "2",
        title: "Token via vendingTES...",
        subtitle: "Token 8455 7543 6278 3535 ...",
        amount: -200,
        date: "Sat, 12 Sept · 20:02",
    },
    {
        id: "3",
        title: "Token via vendingTES...",
        subtitle: "Token 8828 7547 5847 3253 ...",
        amount: -200,
        date: "Sat, 12 Sept · 20:02",
    },
    {
        id: "4",
        title: "Token via vendingTES...",
        subtitle: "Token 1234 5678 9012 3456 ...",
        amount: -200,
        date: "Sat, 12 Sept · 20:01",
    },
    {
        id: "5",
        title: "Token via vendingTES...",
        subtitle: "Token 9876 5432 1098 7654 ...",
        amount: -200,
        date: "Sat, 12 Sept · 20:01",
    },
];

const RecentTransactions: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"customer" | "wallet">("customer");

    return (
        <div className="mt-6 w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <BoltIcon className="text-blue-500" sx={{ fontSize: 20 }} />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent transactions
                    </h2>
                </div>
                <button className="text-sm font-medium text-indigo-500 hover:text-blue-600 transition-colors">
                    See all
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-4 gap-16">
                <button
                    onClick={() => setActiveTab("customer")}
                    className={`flex items-center gap-1.5 px-1 pb-3 mr-6 text-sm font-medium transition-colors relative ${activeTab === "customer"
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <BoltIcon
                        sx={{ fontSize: 16 }}
                        className={activeTab === "customer" ? "text-blue-500" : "text-gray-400"}
                    />
                    Customer
                    {activeTab === "customer" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("wallet")}
                    className={`flex items-center gap-1.5 px-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === "wallet"
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <AccountBalanceWalletOutlinedIcon
                        sx={{ fontSize: 16 }}
                        className={activeTab === "wallet" ? "text-blue-500" : "text-gray-400"}
                    />
                    Wallet
                    {activeTab === "wallet" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                </button>
            </div>

            {
                activeTab === 'customer' ? (
                    <div>
                        {/* Showing count */}
                        <p className="text-xs text-gray-400 mb-4">Showing 5 of 8559</p>

                        {/* Transaction list */}
                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <BoltIcon className="text-amber-500" sx={{ fontSize: 20 }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {tx.title}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                                    {tx.subtitle}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                -₦{Math.abs(tx.amount)}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="justify-center items-center flex">
                        <div className="space-y-8">
                            <div>
                                <Search className="text-amber-600" />
                            </div>
                            <h2 className="text-black font-bold text-lg">Not Found</h2>
                            <h2 className="text-black/60">We could not find what you asked for</h2>
                            <button className="bg-indigo-500 py-3 px-6 rounded-2xl hover:bg-blue-500">
                                <Replay /> Try again
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default RecentTransactions;