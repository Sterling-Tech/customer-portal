
import { getServerSession } from "next-auth";
// import { useSession } from "next-auth/react";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import WalletCard from "@/app/components/dashboard/WalletCard";
import QuickActions from "@/app/components/dashboard/QuickActions";
import ServicesCard from "@/app/components/dashboard/ServicesCard";
import SummaryCards from "@/app/components/dashboard/SummaryCards";
import RecentTransactions from "@/app/components/dashboard/RecentTransactions";

export default async function CustomerDashboard() {
  //   const { data: session, status } = useSession();

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
          Welcome back! <span className="font-bold text-lg">{customer.name}</span> Here's your account overview.
        </p>
      </div>

      {/* Top Dashboard Section */}
      <div className="">
        <WalletCard
          balance={customer?.wallet?.balance ?? 0}
          accountName={customer?.name ?? "Customer"}
          accountNumber={customer?.account_number?.slice(-4) ?? "----"}
          meterNumber={customer?.meter_number}
          meterType={customer.metering_type.name}
          // monthlySpent={dashboardData?.monthly_spent ?? 0}
          // lastPayment={dashboardData?.last_payment ?? 0}
          // energyUsed={dashboardData?.energy_used ?? "—"}
        />

        {/* Additional dashboard content can go here */}
        <QuickActions />
        <SummaryCards />
        <ServicesCard />
        <RecentTransactions />
      </div>
    </div>
  );
}