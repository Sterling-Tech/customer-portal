"use client";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { useRouter } from "next/navigation";

interface WalletCardProps {
    balance?: number;
    accountName?: string;
    accountNumber?: string;
    meterNumber?: string;
    meterType?:string;
    monthlySpent?: number;
    lastPayment?: number;
    energyUsed?: string | number;
    currency?: string;
}

export default function WalletCard({
    balance = 0,
    accountName = "Test account",
    accountNumber = "3173",
    meterNumber = "",
    meterType="",
    monthlySpent = 1000,
    lastPayment = 200,
    energyUsed = "—",
    currency = "NGN",
}: WalletCardProps) {
    const router = useRouter();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount);

    const handlePay = () => {
        router.push("/customer/bills");
    };

    return (
        <div className="relative w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#14151D] px-6 py-16 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
                <p className="text-[11px] font-medium tracking-wide text-gray-400">
                    Wallet balance
                </p>

                <button
                    type="button"
                    onClick={handlePay}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/20 active:scale-95"
                >
                    <AccountBalanceWalletOutlinedIcon
                        sx={{ fontSize: 13 }}
                    />

                    Pay

                    <ArrowForwardRoundedIcon
                        sx={{ fontSize: 12 }}
                    />
                </button>
            </div>

            {/* Wallet Balance */}
            <div className="relative mt-1">
                <h2 className="text-[28px] font-bold leading-tight tracking-tight">
                    {formatCurrency(balance)}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            A/C <span className="font-bold text-lg">••• {accountNumber}</span>
                        </p>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            Meter Number: <span className="font-bold text-lg">{meterNumber} </span>
                        </p>
                    </div>
                    <div>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            Acc Name: <span className="font-bold text-lg">{accountName}</span>
                        </p>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            Meter Type: <span className="font-bold text-lg">{meterType} </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-white/[0.08]" />

            {/* Wallet Statistics */}
            <div className="grid grid-cols-3 divide-x divide-white/10">
                {/* Monthly Spend */}
                <div className="min-w-0 pr-2">
                    <p className="truncate text-[12px] font-semibold text-white">
                        {formatCurrency(monthlySpent)}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        Spent this month
                    </p>
                </div>

                {/* Last Payment */}
                <div className="min-w-0 px-2">
                    <p className="truncate text-[12px] font-semibold text-white">
                        {formatCurrency(lastPayment)}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        Last payment
                    </p>
                </div>

                {/* Energy Used */}
                <div className="min-w-0 pl-2">
                    <div className="flex items-center gap-1">
                        <BoltRoundedIcon
                            sx={{ fontSize: 13, color: "#FACC15" }}
                        />

                        <p className="truncate text-[12px] font-semibold text-white">
                            {typeof energyUsed === "number"
                                ? `${energyUsed} kWh`
                                : energyUsed}
                        </p>
                    </div>

                    <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        Energy used
                    </p>
                </div>
            </div>
        </div>
    );
}