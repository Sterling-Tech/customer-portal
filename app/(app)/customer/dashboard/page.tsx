
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

import WalletCard from "@/app/components/dashboard/WalletCard";
import QuickActions from "@/app/components/dashboard/QuickActions";
import ServicesCard from "@/app/components/dashboard/ServicesCard";
import RecentTransactions from "@/app/components/dashboard/RecentTransactions";
import DebtSummaryCards from "@/app/components/dashboard/DebtSummaryCard";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const customer = session.user.customer;

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back!{" "}
          <span className="text-lg font-bold">
            {customer?.name ?? "Customer"}
          </span>{" "}
          Here's your account overview.
        </p>
      </div>

      {/* Dashboard */}
      <div>
        <WalletCard
          accountName={customer?.name ?? "—"}
          accountNumber={customer?.account_number ?? "—"}
          meterNumber={customer?.meter_number ?? "—"}
          meterType={customer?.metering_type?.name ?? "—"}
        />

        <div className="mt-5">
          <DebtSummaryCards />
        </div>

        <QuickActions />

        <ServicesCard />

        <RecentTransactions />
      </div>
    </div>
  );
}

