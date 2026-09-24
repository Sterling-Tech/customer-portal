import React from "react";
import {
  CreditCardOutlined,
  ReceiptLongOutlined,
  SpeedOutlined,
} from "@mui/icons-material";

type SummaryCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  unit?: string;
};

const SummaryCard = ({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  unit,
}: SummaryCardProps) => {
  return (
    <div className="flex min-h-[185px] flex-1 flex-col rounded-[28px] border border-[#eef0f5] bg-white px-7 py-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      {/* Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-[18px] ${iconBg}`}
      >
        <span className={iconColor}>{icon}</span>
      </div>

      {/* Value */}
      <div className="mt-7">
        <p className="text-[28px] font-bold leading-none tracking-[-0.8px] text-[#111827]">
          {value}
        </p>

        {/* Label */}
        <p className="mt-5 text-[17px] font-normal leading-6 text-[#64748b]">
          {label}
        </p>

        {/* Unit */}
        {unit && (
          <p className="mt-1 text-[17px] font-semibold leading-6 text-[#f2a900]">
            {unit}
          </p>
        )}
      </div>
    </div>
  );
};

export default function SummaryCards() {
  return (
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Last Payment */}
        <SummaryCard
          icon={<CreditCardOutlined sx={{ fontSize: 30 }} />}
          iconBg="bg-[#eef0ff]"
          iconColor="text-[#6575e8]"
          value="₦200"
          label="Last payment"
        />

        {/* Arrears */}
        <SummaryCard
          icon={<ReceiptLongOutlined sx={{ fontSize: 30 }} />}
          iconBg="bg-[#e7faef]"
          iconColor="text-[#39b878]"
          value="₦0"
          label="Arrears"
        />

        {/* Total Energy */}
        <SummaryCard
          icon={<SpeedOutlined sx={{ fontSize: 30 }} />}
          iconBg="bg-[#fff5d9]"
          iconColor="text-[#eeb52c]"
          value="—"
          label="Total energy"
          unit="kWh"
        />
      </div>
    </div>
  );
}