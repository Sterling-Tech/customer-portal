"use client";

import React, { useMemo, useState } from "react";

import {
  BoltOutlined,
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  SearchOutlined,
  AccountBalanceWalletOutlined,
  ReceiptLongOutlined,
  CalendarTodayOutlined,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FilterListOutlined,
  KeyboardArrowDownOutlined,
  ContentCopyOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";

type TransactionStatus = "Successful" | "Pending" | "Failed";

type TransactionType =
  | "Power Purchase"
  | "Wallet Funding"
  | "Bill Payment"
  | "Refund";

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  reference: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  token?: string;
  meterNumber?: string;
}

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    title: "Power Purchase",
    subtitle: "Token via vendingTES...",
    reference: "TRX-20260912-0001",
    amount: -200,
    type: "Power Purchase",
    status: "Successful",
    date: "Sat, 12 Sept 2026 · 20:02",
    token: "2487 4857 5862 6633",
    meterNumber: "12345678911",
  },
  {
    id: "TXN-002",
    title: "Power Purchase",
    subtitle: "Token via vendingTES...",
    reference: "TRX-20260912-0002",
    amount: -500,
    type: "Power Purchase",
    status: "Successful",
    date: "Sat, 12 Sept 2026 · 18:45",
    token: "8455 7543 6278 3535",
    meterNumber: "12345678911",
  },
  {
    id: "TXN-003",
    title: "Wallet Funding",
    subtitle: "Wallet funded via transfer",
    reference: "WAL-20260911-0008",
    amount: 10000,
    type: "Wallet Funding",
    status: "Successful",
    date: "Fri, 11 Sept 2026 · 14:20",
  },
  {
    id: "TXN-004",
    title: "Power Purchase",
    subtitle: "Token via vendingTES...",
    reference: "TRX-20260910-0012",
    amount: -2000,
    type: "Power Purchase",
    status: "Pending",
    date: "Thu, 10 Sept 2026 · 12:32",
    token: "8828 7547 5847 3253",
    meterNumber: "12345678911",
  },
  {
    id: "TXN-005",
    title: "Bill Payment",
    subtitle: "September electricity bill",
    reference: "BIL-20260909-0004",
    amount: -4500,
    type: "Bill Payment",
    status: "Successful",
    date: "Wed, 09 Sept 2026 · 09:15",
  },
  {
    id: "TXN-006",
    title: "Power Purchase",
    subtitle: "Token via vendingTES...",
    reference: "TRX-20260908-0009",
    amount: -1500,
    type: "Power Purchase",
    status: "Failed",
    date: "Tue, 08 Sept 2026 · 21:08",
    token: "1234 5678 9012 3456",
    meterNumber: "12345678911",
  },
  {
    id: "TXN-007",
    title: "Wallet Funding",
    subtitle: "Wallet funded via bank transfer",
    reference: "WAL-20260907-0002",
    amount: 15000,
    type: "Wallet Funding",
    status: "Successful",
    date: "Mon, 07 Sept 2026 · 16:41",
  },
  {
    id: "TXN-008",
    title: "Refund",
    subtitle: "Refund for failed vending transaction",
    reference: "REF-20260906-0003",
    amount: 2000,
    type: "Refund",
    status: "Successful",
    date: "Sun, 06 Sept 2026 · 11:30",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
};

const getStatusStyles = (status: TransactionStatus) => {
  switch (status) {
    case "Successful":
      return {
        container: "bg-green-50 text-green-700 border-green-100",
        icon: "text-green-500",
      };

    case "Pending":
      return {
        container: "bg-amber-50 text-amber-700 border-amber-100",
        icon: "text-amber-500",
      };

    case "Failed":
      return {
        container: "bg-red-50 text-red-700 border-red-100",
        icon: "text-red-500",
      };
  }
};

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "Power Purchase":
      return <BoltOutlined sx={{ fontSize: 21 }} />;

    case "Wallet Funding":
      return <ArrowDownwardOutlined sx={{ fontSize: 21 }} />;

    case "Bill Payment":
      return <ReceiptLongOutlined sx={{ fontSize: 21 }} />;

    case "Refund":
      return <ArrowUpwardOutlined sx={{ fontSize: 21 }} />;

    default:
      return <ReceiptLongOutlined sx={{ fontSize: 21 }} />;
  }
};

const getTransactionIconStyles = (type: TransactionType) => {
  switch (type) {
    case "Power Purchase":
      return "bg-amber-50 text-amber-500";

    case "Wallet Funding":
      return "bg-emerald-50 text-emerald-500";

    case "Bill Payment":
      return "bg-blue-50 text-blue-500";

    case "Refund":
      return "bg-purple-50 text-purple-500";

    default:
      return "bg-gray-50 text-gray-500";
  }
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
          <p className="text-sm font-medium text-gray-500">{title}</p>

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

      <p className="mt-4 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const styles = getStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles.container}`}
    >
      {status === "Successful" && (
        <CheckCircleOutlined
          sx={{ fontSize: 14 }}
          className={styles.icon}
        />
      )}

      {status === "Pending" && (
        <CalendarTodayOutlined
          sx={{ fontSize: 13 }}
          className={styles.icon}
        />
      )}

      {status === "Failed" && (
        <ErrorOutlineOutlined
          sx={{ fontSize: 14 }}
          className={styles.icon}
        />
      )}

      {status}
    </span>
  );
}

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | TransactionStatus
  >("All");

  const [typeFilter, setTypeFilter] = useState<
    "All" | TransactionType
  >("All");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  /*
   * ==============================
   * SUMMARY
   * ==============================
   */

  const totalTransactions = transactions.length;

  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === "Successful"
  ).length;

  const totalSpent = transactions
    .filter(
      (transaction) =>
        transaction.amount < 0 &&
        transaction.status === "Successful"
    )
    .reduce(
      (total, transaction) =>
        total + Math.abs(transaction.amount),
      0
    );

  const totalWalletFunding = transactions
    .filter(
      (transaction) =>
        transaction.amount > 0 &&
        transaction.type === "Wallet Funding"
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  /*
   * ==============================
   * FILTER
   * ==============================
   */

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        transaction.title.toLowerCase().includes(searchValue) ||
        transaction.subtitle.toLowerCase().includes(searchValue) ||
        transaction.reference.toLowerCase().includes(searchValue) ||
        transaction.token?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        transaction.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [search, statusFilter, typeFilter]);

  /*
   * ==============================
   * PAGINATION
   * ==============================
   */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

  const paginatedTransactions =
    filteredTransactions.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  /*
   * ==============================
   * COPY TOKEN
   * ==============================
   */

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
    } catch (error) {
      console.error("Unable to copy token", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your electricity and wallet transactions.
          </p>
        </div>

        {/* ========================================
            SUMMARY CARDS
        ======================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

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
            value={formatCurrency(totalSpent)}
            subtitle="Successful payments"
            icon={
              <BoltOutlined
                sx={{ fontSize: 24 }}
              />
            }
            iconContainer="bg-amber-50 text-amber-500"
            valueColor="text-amber-600"
          />

          <SummaryCard
            title="Successful"
            value={String(successfulTransactions)}
            subtitle="Completed transactions"
            icon={
              <CheckCircleOutlined
                sx={{ fontSize: 24 }}
              />
            }
            iconContainer="bg-green-50 text-green-500"
            valueColor="text-green-600"
          />

          <SummaryCard
            title="Wallet Funding"
            value={formatCurrency(totalWalletFunding)}
            subtitle="Total wallet deposits"
            icon={
              <AccountBalanceWalletOutlined
                sx={{ fontSize: 24 }}
              />
            }
            iconContainer="bg-purple-50 text-purple-500"
            valueColor="text-purple-600"
          />
        </div>

        {/* ========================================
            TRANSACTION SECTION
        ======================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Header */}

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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <FilterListOutlined
                    sx={{ fontSize: 19 }}
                  />

                  Filters
                </button>
              </div>
            </div>

            {/* ========================================
                SEARCH + FILTERS
            ======================================== */}

            <div className="mt-5 flex flex-col gap-3 md:flex-row">

              {/* Search */}

              <div className="relative flex-1">
                <SearchOutlined
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  sx={{ fontSize: 21 }}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    handleFilterChange();
                  }}
                  placeholder="Search transactions..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Type */}

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(
                      event.target.value as
                        | "All"
                        | TransactionType
                    );

                    handleFilterChange();
                  }}
                  className="h-11 min-w-[190px] appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-10 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">
                    All transaction types
                  </option>

                  <option value="Power Purchase">
                    Power Purchase
                  </option>

                  <option value="Wallet Funding">
                    Wallet Funding
                  </option>

                  <option value="Bill Payment">
                    Bill Payment
                  </option>

                  <option value="Refund">
                    Refund
                  </option>
                </select>

                <KeyboardArrowDownOutlined
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  sx={{ fontSize: 20 }}
                />
              </div>

              {/* Status */}

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      event.target.value as
                        | "All"
                        | TransactionStatus
                    );

                    handleFilterChange();
                  }}
                  className="h-11 min-w-[160px] appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 pr-10 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">
                    All statuses
                  </option>

                  <option value="Successful">
                    Successful
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Failed">
                    Failed
                  </option>
                </select>

                <KeyboardArrowDownOutlined
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  sx={{ fontSize: 20 }}
                />
              </div>
            </div>
          </div>

          {/* ========================================
              RESULTS INFO
          ======================================== */}

          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-600">
                {paginatedTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-600">
                {filteredTransactions.length}
              </span>{" "}
              transactions
            </p>
          </div>

          {/* ========================================
              TRANSACTION LIST
          ======================================== */}

          <div className="divide-y divide-gray-100">

            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group px-5 py-4 transition hover:bg-gray-50/70"
                >
                  <div className="flex items-start gap-3">

                    {/* Transaction Icon */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getTransactionIconStyles(
                        transaction.type
                      )}`}
                    >
                      {getTransactionIcon(
                        transaction.type
                      )}
                    </div>

                    {/* Main Content */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-2 sm:flex-row">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-gray-900">
                              {transaction.title}
                            </h3>

                            <StatusBadge
                              status={transaction.status}
                            />
                          </div>

                          <p className="mt-1 truncate text-xs text-gray-400">
                            {transaction.subtitle}
                          </p>
                        </div>

                        {/* Amount */}

                        <div className="shrink-0 text-left sm:text-right">
                          <p
                            className={`text-sm font-bold ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {transaction.amount > 0
                              ? "+"
                              : "-"}
                            {formatCurrency(
                              transaction.amount
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Transaction Metadata */}

                      <div className="mt-3 flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:gap-5">

                        <span>
                          {transaction.date}
                        </span>

                        <span className="hidden sm:inline">
                          •
                        </span>

                        <span>
                          Ref:{" "}
                          <span className="font-medium text-gray-500">
                            {transaction.reference}
                          </span>
                        </span>

                        {transaction.token && (
                          <>
                            <span className="hidden sm:inline">
                              •
                            </span>

                            <div className="flex items-center gap-1">
                              <span>
                                Token:{" "}
                                <span className="font-medium text-gray-500">
                                  {transaction.token}
                                </span>
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  copyToken(
                                    transaction.token!
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

                    {/* More */}

                    <button
                      type="button"
                      className="hidden rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 sm:block"
                    >
                      <MoreHorizOutlined
                        sx={{ fontSize: 20 }}
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              /* ========================================
                  EMPTY STATE
              ======================================== */

              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <SearchOutlined
                    className="text-gray-400"
                    sx={{ fontSize: 28 }}
                  />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  No transactions found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  We could not find any transactions matching
                  your search or selected filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setTypeFilter("All");
                    setCurrentPage(1);
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* ========================================
              PAGINATION
          ======================================== */}

          {filteredTransactions.length > 0 && (
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
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
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