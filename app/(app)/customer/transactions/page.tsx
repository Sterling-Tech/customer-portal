
"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
    BoltOutlined,
    SearchOutlined,
    AccountBalanceWalletOutlined,
    ReceiptLongOutlined,
    KeyboardArrowDownOutlined,
    ContentCopyOutlined,
    ArrowDownwardOutlined,
} from "@mui/icons-material";

import {
    getTransactions,
    Transaction,
} from "@/app/services/transactionService";

const PAGE_SIZE = 10;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));
};

const formatDate = (timestamp: string) => {
    if (!timestamp) return "—";

    return new Intl.DateTimeFormat("en-NG", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(timestamp));
};

const getTransactionTitle = (transaction: Transaction) => {
    const reference = transaction.transaction_ref?.toUpperCase() || "";

    if (reference.includes("WALLETVEND")) {
        return "Wallet Vending";
    }

    if (reference.includes("WALLET")) {
        return "Wallet Transaction";
    }

    if (reference.includes("VEND")) {
        return "Power Purchase";
    }

    return "Transaction";
};

const getTransactionSubtitle = (transaction: Transaction) => {
    const vendorName = transaction.vendor?.business_name;

    if (vendorName) {
        return `Processed by ${vendorName}`;
    }

    return "Electricity transaction";
};

const getTransactionIcon = (transaction: Transaction) => {
    const title = getTransactionTitle(transaction);

    if (title === "Wallet Vending") {
        return (
            <AccountBalanceWalletOutlined
                sx={{ fontSize: 21 }}
            />
        );
    }

    return (
        <BoltOutlined
            sx={{ fontSize: 21 }}
        />
    );
};

const getTransactionIconStyles = (transaction: Transaction) => {
    const title = getTransactionTitle(transaction);

    if (title === "Wallet Vending") {
        return "bg-emerald-50 text-emerald-500";
    }

    return "bg-amber-50 text-amber-500";
};

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
    iconContainer,
    valueColor = "text-gray-900",
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    iconContainer: string;
    valueColor?: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h3
                        className={`mt-2 text-2xl font-bold tracking-tight ${valueColor}`}
                    >
                        {value}
                    </h3>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconContainer}`}
                >
                    {icon}
                </div>
            </div>

            <p className="mt-4 text-xs text-gray-400">
                {subtitle}
            </p>
        </div>
    );
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [totalCount, setTotalCount] = useState(0);

    const [nextPage, setNextPage] = useState<string | null>(null);

    const [previousPage, setPreviousPage] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | FETCH TRANSACTIONS
    |--------------------------------------------------------------------------
    */

    const loadTransactions = async (page: number) => {
        try {
            setLoading(true);
            setError("");

            const response = await getTransactions(page);

            console.log(
                "Transaction API response:",
                response
            );

            setTransactions(response?.results ?? []);

            setTotalCount(response?.count ?? 0);

            setNextPage(response?.next ?? null);

            setPreviousPage(
                response?.previous ?? null
            );
        } catch (error) {
            console.error(
                "Failed to fetch transaction history:",
                error
            );

            setTransactions([]);

            setTotalCount(0);

            setNextPage(null);

            setPreviousPage(null);

            setError(
                "Unable to load transaction history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions(currentPage);
    }, [currentPage]);

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    const filteredTransactions = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase();

        if (!searchValue) {
            return transactions;
        }

        return transactions.filter(
            (transaction) => {
                const title =
                    getTransactionTitle(
                        transaction
                    ).toLowerCase();

                const subtitle =
                    getTransactionSubtitle(
                        transaction
                    ).toLowerCase();

                const reference =
                    transaction.transaction_ref
                        ?.toLowerCase() || "";

                const token =
                    transaction.token
                        ?.toLowerCase() || "";

                const vendor =
                    transaction.vendor
                        ?.business_name
                        ?.toLowerCase() || "";

                return (
                    title.includes(searchValue) ||
                    subtitle.includes(searchValue) ||
                    reference.includes(searchValue) ||
                    token.includes(searchValue) ||
                    vendor.includes(searchValue)
                );
            }
        );
    }, [transactions, search]);

    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    const totalTransactions = totalCount;

    const totalSpent = transactions
        .filter(
            (transaction) =>
                Number(transaction.amount) < 0
        )
        .reduce(
            (total, transaction) =>
                total +
                Math.abs(
                    Number(transaction.amount)
                ),
            0
        );

    const totalWalletFunding = transactions
        .filter(
            (transaction) =>
                Number(transaction.amount) > 0
        )
        .reduce(
            (total, transaction) =>
                total +
                Number(transaction.amount),
            0
        );

    /*
    |--------------------------------------------------------------------------
    | COPY TOKEN
    |--------------------------------------------------------------------------
    */

    const copyToken = async (
        token: string
    ) => {
        try {
            await navigator.clipboard.writeText(
                token
            );
        } catch (error) {
            console.error(
                "Unable to copy token",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const handlePrevious = () => {
        if (previousPage) {
            setCurrentPage((page) =>
                Math.max(1, page - 1)
            );
        }
    };

    const handleNext = () => {
        if (nextPage) {
            setCurrentPage((page) =>
                page + 1
            );
        }
    };

    const totalPages = Math.ceil(
        totalCount / PAGE_SIZE
    );

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

                {/* PAGE HEADER */}

                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View your electricity and wallet transactions.
                    </p>
                </div>

                {/* SUMMARY CARDS */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    <SummaryCard
                        title="Total Transactions"
                        value={String(totalTransactions)}
                        subtitle="All recorded transactions"
                        icon={
                            <ReceiptLongOutlined
                                sx={{ fontSize: 24 }}
                            />
                        }
                        iconContainer="bg-blue-50 text-blue-600"
                    />

                    <SummaryCard
                        title="Total Spent"
                        value={formatCurrency(
                            totalSpent
                        )}
                        subtitle="Transactions on this page"
                        icon={
                            <BoltOutlined
                                sx={{ fontSize: 24 }}
                            />
                        }
                        iconContainer="bg-amber-50 text-amber-500"
                        valueColor="text-amber-600"
                    />

                    <SummaryCard
                        title="Wallet Funding"
                        value={formatCurrency(
                            totalWalletFunding
                        )}
                        subtitle="Positive transactions on this page"
                        icon={
                            <AccountBalanceWalletOutlined
                                sx={{ fontSize: 24 }}
                            />
                        }
                        iconContainer="bg-purple-50 text-purple-500"
                        valueColor="text-purple-600"
                    />

                </div>

                {/* TRANSACTION SECTION */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                    {/* HEADER */}

                    <div className="border-b border-gray-100 p-5">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Transaction history
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    A record of your recent account activity.
                                </p>
                            </div>

                        </div>

                        {/* SEARCH */}

                        <div className="mt-5 flex flex-col gap-3 md:flex-row">

                            <div className="relative flex-1">

                                <SearchOutlined
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    sx={{
                                        fontSize: 21,
                                    }}
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(
                                            event.target.value
                                        );
                                    }}
                                    placeholder="Search transactions..."
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />

                            </div>

                        </div>
                    </div>

                    {/* RESULTS INFO */}

                    <div className="border-b border-gray-100 px-5 py-3">
                        <p className="text-xs text-gray-400">
                            Showing{" "}
                            <span className="font-medium text-gray-600">
                                {filteredTransactions.length}
                            </span>{" "}
                            transactions on page{" "}
                            <span className="font-medium text-gray-600">
                                {currentPage}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-gray-600">
                                {totalPages || 1}
                            </span>
                        </p>
                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="px-5 py-10 text-center">
                            <p className="text-sm text-red-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    loadTransactions(
                                        currentPage
                                    )
                                }
                                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* LOADING */}

                    {loading && !error && (
                        <div className="divide-y divide-gray-100">

                            {Array.from({
                                length: 5,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse px-5 py-5"
                                >
                                    <div className="flex gap-3">

                                        <div className="h-11 w-11 rounded-full bg-gray-200" />

                                        <div className="flex-1">

                                            <div className="h-4 w-40 rounded bg-gray-200" />

                                            <div className="mt-2 h-3 w-64 rounded bg-gray-100" />

                                            <div className="mt-3 h-3 w-80 rounded bg-gray-100" />

                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* TRANSACTIONS */}

                    {!loading &&
                        !error &&
                        filteredTransactions.length > 0 && (
                            <div className="divide-y divide-gray-100">

                                {filteredTransactions.map(
                                    (transaction) => {
                                        const amount =
                                            Number(
                                                transaction.amount
                                            );

                                        const isCredit =
                                            amount > 0;

                                        return (
                                            <div
                                                key={
                                                    transaction.id
                                                }
                                                className="group px-5 py-4 transition hover:bg-gray-50/70"
                                            >
                                                <div className="flex items-start gap-3">

                                                    {/* ICON */}

                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getTransactionIconStyles(
                                                            transaction
                                                        )}`}
                                                    >
                                                        {getTransactionIcon(
                                                            transaction
                                                        )}
                                                    </div>

                                                    {/* CONTENT */}

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col justify-between gap-2 sm:flex-row">

                                                            <div className="min-w-0">

                                                                <div className="flex flex-wrap items-center gap-2">

                                                                    <h3 className="truncate text-sm font-semibold text-gray-900">
                                                                        {getTransactionTitle(
                                                                            transaction
                                                                        )}
                                                                    </h3>

                                                                    <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                                                                        Recorded
                                                                    </span>

                                                                </div>

                                                                <p className="mt-1 truncate text-xs text-gray-400">
                                                                    {getTransactionSubtitle(
                                                                        transaction
                                                                    )}
                                                                </p>

                                                            </div>

                                                            {/* AMOUNT */}

                                                            <div className="shrink-0 text-left sm:text-right">

                                                                <p
                                                                    className={`text-sm font-bold ${
                                                                        isCredit
                                                                            ? "text-green-600"
                                                                            : "text-gray-900"
                                                                    }`}
                                                                >
                                                                    {isCredit
                                                                        ? "+"
                                                                        : "-"}
                                                                    {formatCurrency(
                                                                        amount
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>

                                                        {/* METADATA */}

                                                        <div className="mt-3 flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:gap-5">

                                                            <span>
                                                                {formatDate(
                                                                    transaction.timestamp
                                                                )}
                                                            </span>

                                                            <span className="hidden sm:inline">
                                                                •
                                                            </span>

                                                            <span>
                                                                Ref:{" "}
                                                                <span className="font-medium text-gray-500">
                                                                    {
                                                                        transaction.transaction_ref
                                                                    }
                                                                </span>
                                                            </span>

                                                            {transaction.vendor
                                                                ?.business_name && (
                                                                <>
                                                                    <span className="hidden sm:inline">
                                                                        •
                                                                    </span>

                                                                    <span>
                                                                        Vendor:{" "}
                                                                        <span className="font-medium text-gray-500">
                                                                            {
                                                                                transaction
                                                                                    .vendor
                                                                                    .business_name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </>
                                                            )}

                                                            {transaction.token && (
                                                                <>
                                                                    <span className="hidden sm:inline">
                                                                        •
                                                                    </span>

                                                                    <div className="flex items-center gap-1">

                                                                        <span className="truncate">
                                                                            Token:{" "}
                                                                            <span className="font-medium text-gray-500">
                                                                                {
                                                                                    transaction.token
                                                                                }
                                                                            </span>
                                                                        </span>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                copyToken(
                                                                                    transaction.token
                                                                                )
                                                                            }
                                                                            className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-blue-500"
                                                                            title="Copy token"
                                                                        >
                                                                            <ContentCopyOutlined
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                }}
                                                                            />
                                                                        </button>

                                                                    </div>
                                                                </>
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredTransactions.length === 0 && (
                            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">

                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

                                    <SearchOutlined
                                        className="text-gray-400"
                                        sx={{
                                            fontSize: 28,
                                        }}
                                    />

                                </div>

                                <h3 className="mt-4 text-base font-semibold text-gray-900">
                                    No transactions found
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-gray-500">
                                    We could not find any transactions matching your search.
                                </p>

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Clear search
                                    </button>
                                )}

                            </div>
                        )}

                    {/* PAGINATION */}

                    {!loading &&
                        !error &&
                        totalCount > 0 && (
                            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">

                                <p className="text-xs text-gray-500">
                                    Page{" "}
                                    <span className="font-semibold text-gray-700">
                                        {currentPage}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-700">
                                        {totalPages}
                                    </span>
                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        disabled={
                                            !previousPage ||
                                            loading
                                        }
                                        onClick={
                                            handlePrevious
                                        }
                                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            !nextPage ||
                                            loading
                                        }
                                        onClick={
                                            handleNext
                                        }
                                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>
                        )}

                </div>
            </div>
        </div>
    );
}
