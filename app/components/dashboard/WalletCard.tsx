

// "use client";

// import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
// import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
// import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
// import { useRouter } from "next/navigation";

// interface WalletCardProps {
//   balance: number | string;
//   accountName: string;
//   accountNumber: string;
//   meterNumber: string;
//   meterType: string;
//   monthlySpent?: number | string;
//   lastPayment?: number | string;
//   energyUsed?: string | number;
//   currency?: string;
// }

// export default function WalletCard({
//   balance,
//   accountName,
//   accountNumber,
//   meterNumber,
//   meterType,
//   monthlySpent = 0,
//   lastPayment = 0,
//   energyUsed = "—",
//   currency = "NGN",
// }: WalletCardProps) {
//   const router = useRouter();

//   const formatCurrency = (amount: number | string) => {
//     const numericAmount = Number(amount || 0);

//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency,
//       maximumFractionDigits: 0,
//     }).format(numericAmount);
//   };

//   const handlePay = () => {
//     router.push("/customer/bills");
//   };

//   return (
//     <div className="relative w-full overflow-hidden rounded-[22px] border border-white/10 bg-blue-800 px-6 py-8 text-white shadow-sm">
//       {/* Background glow */}
//       <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

//       {/* Header */}
//       <div className="relative flex items-center justify-between">
//         <p className="text-[11px] font-medium tracking-wide text-white">
//           Wallet balance
//         </p>

//         <button
//           type="button"
//           onClick={handlePay}
//           className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/20 active:scale-95"
//         >
//           <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 13 }} />

//           Pay

//           <ArrowForwardRoundedIcon sx={{ fontSize: 12 }} />
//         </button>
//       </div>

//       {/* Wallet Balance */}
//       <div className="relative mt-2">
//         <h2 className="text-[28px] font-bold leading-tight tracking-tight">
//           {formatCurrency(balance)}
//         </h2>

//         <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
//           {/* Account details */}
//           <div>
//             <p className="mt-1.5 text-[11px] text-white/70">
//               A/C{" "}
//               <span className="ml-1 text-sm font-bold text-white">
//                 ••• {accountNumber}
//               </span>
//             </p>

//             <p className="mt-2 text-[11px] text-white/70">
//               Meter Number:{" "}
//               <span className="ml-1 text-sm font-bold text-white">
//                 {meterNumber || "—"}
//               </span>
//             </p>
//           </div>

//           {/* Customer details */}
//           <div>
//             <p className="mt-1.5 text-[11px] text-white/70">
//               Acc Name:{" "}
//               <span className="ml-1 text-sm font-bold text-white">
//                 {accountName || "—"}
//               </span>
//             </p>

//             <p className="mt-2 text-[11px] text-white/70">
//               Meter Type:{" "}
//               <span className="ml-1 text-sm font-bold capitalize text-white">
//                 {meterType || "—"}
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="my-5 h-px bg-white/[0.08]" />

//       {/* Wallet Statistics */}
//       <div className="grid grid-cols-3 divide-x divide-white/10">
//         {/* Monthly Spend */}
//         <div className="min-w-0 pr-2">
//           <p className="truncate text-[12px] font-semibold text-white">
//             {formatCurrency(monthlySpent)}
//           </p>

//           <p className="mt-0.5 truncate text-[10px] text-white/60">
//             Spent this month
//           </p>
//         </div>

//         {/* Last Payment */}
//         <div className="min-w-0 px-2">
//           <p className="truncate text-[12px] font-semibold text-white">
//             {formatCurrency(lastPayment)}
//           </p>

//           <p className="mt-0.5 truncate text-[10px] text-white/60">
//             Last payment
//           </p>
//         </div>

//         {/* Energy Used */}
//         <div className="min-w-0 pl-2">
//           <div className="flex items-center gap-1">
//             <BoltRoundedIcon
//               sx={{
//                 fontSize: 13,
//                 color: "#FACC15",
//               }}
//             />

//             <p className="truncate text-[12px] font-semibold text-white">
//               {typeof energyUsed === "number"
//                 ? `${energyUsed} kWh`
//                 : energyUsed || "—"}
//             </p>
//           </div>

//           <p className="mt-0.5 truncate text-[10px] text-white/60">
//             Energy used
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import { useRouter } from "next/navigation";

import { getAccountDetails } from "@/app/services/accountService";

interface WalletCardProps {
  accountName: string;
  accountNumber: string;
  meterNumber: string;
  meterType: string;

  monthlySpent?: number | string;
  lastPayment?: number | string;
  energyUsed?: string | number;

  currency?: string;
}

export default function WalletCard({
  accountName,
  accountNumber,
  meterNumber,
  meterType,
  monthlySpent = 0,
  lastPayment = 0,
  energyUsed = "—",
  currency = "NGN",
}: WalletCardProps) {
  const router = useRouter();

  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number | string) => {
    const numericAmount = Number(amount || 0);

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  const loadWallet = async () => {
    try {
      setLoading(true);

      const response = await getAccountDetails();

      setBalance(response.wallet?.balance ?? "0");
    } catch (error) {
      console.error("Failed to load wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handlePay = () => {
    router.push("/customer/bills");
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[22px] border border-white/10 bg-blue-800 px-6 py-8 text-white shadow-sm">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <p className="text-[11px] font-medium tracking-wide text-white">
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
      <div className="relative mt-2">
        <h2 className="text-[28px] font-bold leading-tight tracking-tight">
          {loading ? (
            <span className="inline-block h-8 w-32 animate-pulse rounded bg-white/20" />
          ) : (
            formatCurrency(balance)
          )}
        </h2>

        {/* Account information */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
          <div>
            <p className="text-[11px] text-white/70">
              A/C
              <span className="ml-1 text-sm font-bold text-white">
                ••• {accountNumber?.slice(-4) || "—"}
              </span>
            </p>

            <p className="mt-2 text-[11px] text-white/70">
              Meter Number:
              <span className="ml-1 text-sm font-bold text-white">
                {meterNumber || "—"}
              </span>
            </p>
          </div>

          <div>
            <p className="text-[11px] text-white/70">
              Acc Name:
              <span className="ml-1 text-sm font-bold text-white">
                {accountName || "—"}
              </span>
            </p>

            <p className="mt-2 text-[11px] text-white/70">
              Meter Type:
              <span className="ml-1 text-sm font-bold capitalize text-white">
                {meterType || "—"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-white/[0.08]" />

      {/* Wallet Statistics */}
      <div className="grid grid-cols-3 divide-x divide-white/10">
        {/* Monthly Spend */}
        <div className="min-w-0 pr-2">
          <p className="truncate text-[12px] font-semibold text-white">
            {formatCurrency(monthlySpent)}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-white/60">
            Spent this month
          </p>
        </div>

        {/* Last Payment */}
        <div className="min-w-0 px-2">
          <p className="truncate text-[12px] font-semibold text-white">
            {formatCurrency(lastPayment)}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-white/60">
            Last payment
          </p>
        </div>

        {/* Energy Used */}
        <div className="min-w-0 pl-2">
          <div className="flex items-center gap-1">
            <BoltRoundedIcon
              sx={{
                fontSize: 13,
                color: "#FACC15",
              }}
            />

            <p className="truncate text-[12px] font-semibold text-white">
              {typeof energyUsed === "number"
                ? `${energyUsed} kWh`
                : energyUsed || "—"}
            </p>
          </div>

          <p className="mt-0.5 truncate text-[10px] text-white/60">
            Energy used
          </p>
        </div>
      </div>
    </div>
  );
}


