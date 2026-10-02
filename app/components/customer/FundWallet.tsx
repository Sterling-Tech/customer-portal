"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import { WalletHistory } from "@/app/services/walletService";

interface FundWalletProps {
    balance: number;
    accountName: string;
    accountNumber: string;
    addedThisMonth: number;
    currency: string;

    topUps: WalletHistory[];

    onSetup?: () => void;

    onTopUp?: (data: {
        amount: number;
    }) => void | Promise<void>;

    onSendMoney?: (data: {
        recipientWalletId: string;
        amount: number;
    }) => void | Promise<void>;
}

type ActiveTab = "topup" | "transfer";

const presetAmounts = [1000, 2000, 5000, 10000, 20000];
export const getStatusStyles = (
        status: WalletHistory["status"]
    ) => {
        switch (status) {
            case "successful":
                return {
                    badge: "bg-green-50 text-green-700",
                    icon: "bg-green-50 text-green-600",
                };

            case "pending":
                return {
                    badge: "bg-amber-50 text-amber-700",
                    icon: "bg-amber-50 text-amber-600",
                };

            case "abandoned":
                return {
                    badge: "bg-red-50 text-red-700",
                    icon: "bg-red-50 text-red-600",
                };

            default:
                return {
                    badge: "bg-gray-50 text-gray-700",
                    icon: "bg-gray-50 text-gray-600",
                };
        }
    };
    
export default function FundWallet({
    balance,
    accountName,
    accountNumber,
    addedThisMonth,
    topUps,
    currency,
    onSetup,
    onTopUp,
    onSendMoney,
}: FundWalletProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<ActiveTab>("topup");

    const [amount, setAmount] = useState("");
    const [recipientWalletId, setRecipientWalletId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const numericAmount = Number(amount);

    /* ---------------------------------------------
     * Currency formatter
     * --------------------------------------------- */

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(value);
    };
    // date formatter
    const formatDate = (date: string) => {
        if (!date) return "-";

        return new Intl.DateTimeFormat("en-NG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    const getAmount = (amount: string) => {
        const value = Number(amount);

        return Number.isFinite(value) ? value : 0;
    };
    /* ---------------------------------------------
     * Change tab
     * --------------------------------------------- */

    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);

        setError("");

        // Keep amount when switching tabs if desired.
        // Clear recipient when going back to top up.
        if (tab === "topup") {
            setRecipientWalletId("");
        }
    };

    /* ---------------------------------------------
     * Amount input
     * --------------------------------------------- */

    const handleAmountChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
            setError("");
        }
    };

    /* ---------------------------------------------
     * Preset amount
     * --------------------------------------------- */

    const handlePresetAmount = (value: number) => {
        setAmount(value.toString());
        setError("");
    };

    /* ---------------------------------------------
     * Top up
     * --------------------------------------------- */

    const handleTopUp = async () => {
        setError("");

        if (!numericAmount || numericAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (numericAmount < 100) {
            setError("Minimum top-up amount is ₦100.");
            return;
        }

        if (!onTopUp) {
            setError(
                "Wallet funding service is not configured yet."
            );
            return;
        }

        try {
            setLoading(true);

            await onTopUp({
                amount: numericAmount,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to fund your wallet. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------
     * Send money
     * --------------------------------------------- */

    const handleSendMoney = async () => {
        setError("");

        if (!recipientWalletId.trim()) {
            setError("Please enter the recipient's wallet ID.");
            return;
        }

        if (!numericAmount || numericAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (numericAmount < 100) {
            setError("Minimum transfer amount is ₦100.");
            return;
        }

        if (!onSendMoney) {
            setError("Transfer service is not configured yet.");
            return;
        }

        try {
            setLoading(true);

            await onSendMoney({
                recipientWalletId: recipientWalletId.trim(),
                amount: numericAmount,
            });

            setAmount("");
            setRecipientWalletId("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to send money. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------
     * Form validation
     * --------------------------------------------- */

    const topUpValid =
        Number.isFinite(numericAmount) &&
        numericAmount >= 100;

    const transferValid =
        recipientWalletId.trim().length > 0 &&
        numericAmount >= 100;

    const canSubmit =
        activeTab === "topup"
            ? topUpValid
            : transferValid;


    
    return (
        <div className="min-h-screen">
            <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">

                {/* =====================================================
            PAGE HEADER
        ====================================================== */}

                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">

                        {/* Back */}
                        <button
                            type="button"
                            onClick={() => router.back()}
                            aria-label="Go back"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <ArrowBackRoundedIcon />
                        </button>

                        {/* Title */}
                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                                Fund wallet
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 sm:text-base">
                                {/* {activeTab === "topup"
                                    ? "Add money to your wallet"
                                    : "Send to another wallet"} */}
                                Add money to your wallet
                            </p>
                        </div>
                    </div>

                    {/* History */}
                    <button
                        type="button"
                        aria-label="Transaction history"
                        onClick={() =>
                            router.push("/customer/transactions")
                        }
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-indigo-500 shadow-sm transition hover:bg-indigo-50"
                    >
                        <AccessTimeOutlinedIcon />
                    </button>
                </div>

                {/* =====================================================
            WALLET CARD
        ====================================================== */}

                <section className="relative overflow-hidden rounded-[28px] bg-[#15161D] p-5 text-white shadow-[0_10px_30px_rgba(15,23,42,0.15)] sm:p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-400 sm:text-base">
                            Wallet balance
                        </p>

                        <button
                            type="button"
                            onClick={onSetup}
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:text-sm"
                        >
                            <AccountBalanceWalletOutlinedIcon
                                sx={{ fontSize: 17 }}
                            />

                            Set up
                        </button>
                    </div>

                    {/* Balance */}
                    <h2 className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                        {formatCurrency(balance)}
                    </h2>

                    {/* Account */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-400">
                            {accountName} · A/C
                        </p>

                        <p className="text-sm tracking-wide text-gray-400">
                            {accountNumber}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="my-5 h-px bg-white/10" />

                    {/* Stats */}
                    <div className="grid grid-cols-3 divide-x divide-white/10">

                        {/* Added */}
                        <div className="min-w-0 pr-3">
                            <p className="truncate text-base font-semibold sm:text-lg">
                                {formatCurrency(addedThisMonth)}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-400 sm:text-sm">
                                Added this month
                            </p>
                        </div>

                        {/* Top ups */}
                        <div className="min-w-0 px-3">
                            <p className="text-base font-semibold sm:text-lg">
                                {topUps.length}
                            </p>
                            <p className="mt-1 truncate text-xs text-gray-400 sm:text-sm">
                                Top ups
                            </p>
                        </div>

                        {/* Currency */}
                        <div className="min-w-0 pl-3">
                            <p className="text-base font-semibold sm:text-lg">
                                {currency}
                            </p>

                            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                                Currency
                            </p>
                        </div>
                    </div>
                </section>

                {/* =====================================================
            FORM CARD
        ====================================================== */}

                <section className="rounded-[26px] border border-gray-200/70 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 grid grid-cols-2 rounded-2xl bg-[#EDF1FA] p-1.5">

                        {/* Top Up */}
                        <button
                            type="button"
                            onClick={() => handleTabChange("topup")}
                            className={`rounded-xl px-3 py-3 text-sm font-semibold transition-all sm:text-base ${activeTab === "topup"
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Top up my wallet
                        </button>

                        {/* Send */}
                        {/* <button
                            type="button"
                            onClick={() => handleTabChange("transfer")}
                            className={`rounded-xl px-3 py-3 text-sm font-semibold transition-all sm:text-base ${activeTab === "transfer"
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Send to someone
                        </button> */}
                    </div>

                    {/* =================================================
              TOP UP CONTENT
          ================================================== */}

                    {activeTab === "topup" && (
                        <>
                            {/* Title */}
                            <div className="mb-5 flex items-center gap-3">
                                <PaymentsOutlinedIcon
                                    className="text-indigo-500"
                                    sx={{ fontSize: 24 }}
                                />

                                <h2 className="text-xl font-bold text-[#172033]">
                                    How much?
                                </h2>
                            </div>

                            {/* Amount label */}
                            <label
                                htmlFor="wallet-amount"
                                className="mb-2 block text-sm font-medium text-gray-500 sm:text-base"
                            >
                                Amount
                            </label>

                            {/* Amount input */}
                            <div className="flex h-[82px] items-center gap-2 rounded-2xl border border-gray-100 bg-[#F6F8FC] px-4 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 sm:px-5">

                                <span className="text-2xl font-semibold text-gray-500 sm:text-3xl">
                                    ₦
                                </span>

                                <input
                                    id="wallet-amount"
                                    type="number"
                                    min="100"
                                    step="0.01"
                                    inputMode="decimal"
                                    placeholder="0"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="h-full w-full min-w-0 bg-transparent text-3xl font-bold text-gray-700 outline-none placeholder:text-gray-400 sm:text-4xl"
                                />
                            </div>

                            {/* Presets */}
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {presetAmounts.map((value) => {
                                    const selected =
                                        numericAmount === value;

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                handlePresetAmount(value)
                                            }
                                            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:text-base ${selected
                                                ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                                                }`}
                                        >
                                            {formatCurrency(value)}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* =================================================
              SEND TO SOMEONE CONTENT
          ================================================== */}

                    {/* {activeTab === "transfer" && (
                        <>
                            <div className="mb-6">

                                <label
                                    htmlFor="recipient-wallet"
                                    className="mb-2 block text-sm font-medium text-gray-500 sm:text-base"
                                >
                                    Recipient wallet ID
                                </label>

                                <div className="flex h-[66px] items-center gap-3 rounded-2xl border border-gray-100 bg-[#F6F8FC] px-4 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">

                                    <PersonOutlineRoundedIcon
                                        className="shrink-0 text-gray-400"
                                        sx={{ fontSize: 24 }}
                                    />

                                    <input
                                        id="recipient-wallet"
                                        type="text"
                                        value={recipientWalletId}
                                        onChange={(event) => {
                                            setRecipientWalletId(
                                                event.target.value
                                            );
                                            setError("");
                                        }}
                                        placeholder="Enter the wallet ID"
                                        className="h-full w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 sm:text-lg"
                                    />
                                </div>
                            </div>

                           
                            <div>

                                <label
                                    htmlFor="transfer-amount"
                                    className="mb-2 block text-sm font-medium text-gray-500 sm:text-base"
                                >
                                    Amount
                                </label>

                                <div className="flex h-[82px] items-center gap-2 rounded-2xl border border-gray-100 bg-[#F6F8FC] px-4 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 sm:px-5">

                                    <span className="text-2xl font-semibold text-gray-500 sm:text-3xl">
                                        ₦
                                    </span>

                                    <input
                                        id="transfer-amount"
                                        type="number"
                                        min="100"
                                        step="0.01"
                                        inputMode="decimal"
                                        placeholder="0"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        className="h-full w-full min-w-0 bg-transparent text-3xl font-bold text-gray-700 outline-none placeholder:text-gray-400 sm:text-4xl"
                                    />
                                </div>
                            </div>

                            
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {presetAmounts.map((value) => {
                                    const selected =
                                        numericAmount === value;

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                handlePresetAmount(value)
                                            }
                                            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:text-base ${selected
                                                ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                                                }`}
                                        >
                                            {formatCurrency(value)}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )} */}

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}
                </section>

                {activeTab === "transfer" && (
                    <div className="flex items-start gap-3 px-1 text-sm text-gray-500 sm:text-base">

                        <InfoOutlinedIcon
                            className="mt-0.5 shrink-0 text-indigo-400"
                            sx={{ fontSize: 19 }}
                        />

                        <p>
                            {recipientWalletId
                                ? `You are sending ${amount
                                    ? formatCurrency(numericAmount)
                                    : "money"
                                } to wallet ${recipientWalletId}`
                                : "Enter the recipient's wallet ID"}
                        </p>
                    </div>
                )}

                {/* =====================================================
            ACTION BUTTON
        ====================================================== */}

                <button
                    type="button"
                    disabled={!canSubmit || loading}
                    onClick={
                        handleTopUp
                    }
                    // onClick={
                    //     activeTab === "topup"
                    //         ? handleTopUp
                    //         : handleSendMoney
                    // }
                    className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-2xl bg-indigo-500 px-5 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:text-white/70"
                >
                    {loading ? (
                        <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                            {activeTab === "topup"
                                ? "Opening payment..."
                                : "Sending..."}
                        </>
                    ) : activeTab === "topup" ? (
                        <>
                            <AddCardOutlinedIcon />

                            Add money
                        </>
                    ) : (
                        <>
                            <SendRoundedIcon />

                            Send money
                        </>
                    )}
                </button>

            {/* RECENT TOP UPS */}
      
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
                                                {formatCurrency(amount)}
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
            </div>
        </div>
    );
}