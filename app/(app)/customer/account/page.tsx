"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowBack,
  IosShare,
  CheckCircle,
  Bolt,
  Speed,
  Category,
  Receipt,
  History,
  VpnKey,
  ContentCopy,
  Person,
  Layers,
  ShowChart,
  LocationOn,
  Refresh,
  AccountBalanceWallet,
  InfoOutlined,
} from "@mui/icons-material";

import {
  getAccountDetails,
  AccountResponse,
} from "@/app/services/accountService";

export default function AccountDetails() {
  const router = useRouter();

  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState("");

  // ========================================
  // FETCH ACCOUNT DETAILS
  // ========================================

  const fetchAccountDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccountDetails();

      setData(response);
    } catch (err: unknown) {
      console.error("Failed to fetch account details:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Unable to load your account details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountDetails();
  }, [fetchAccountDetails]);

  // ========================================
  // COPY TO CLIPBOARD
  // ========================================

  const copyToClipboard = async (
    text: string,
    field: string
  ) => {
    if (!text || text === "N/A") return;

    try {
      await navigator.clipboard.writeText(text);

      setCopiedField(field);

      setTimeout(() => {
        setCopiedField("");
      }, 2000);
    } catch {
      console.error("Unable to copy to clipboard");
    }
  };

  // ========================================
  // CURRENCY FORMATTER
  // ========================================

  const formatCurrency = (value: string | number) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return "₦0.00";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#F5F7FC]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

        <p className="text-sm font-medium text-gray-500">
          Loading account details...
        </p>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F5F7FC] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <InfoOutlined
            className="mb-3 text-red-500"
            sx={{ fontSize: 36 }}
          />

          <h2 className="text-lg font-bold text-gray-900">
            Unable to load account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "No account details were returned."}
          </p>

          <button
            type="button"
            onClick={fetchAccountDetails}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Refresh fontSize="small" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // API DATA
  // ========================================

  const { personal, meta, location, wallet } = data;

  const isActive = personal.account_status === "active";

  const accountNumber = personal.account_number || "N/A";
  const meterNumber = personal.meter_number || "N/A";

  const customerName = personal.name || "N/A";
  const customerClass = meta.customer_class?.name || "N/A";
  const customerCategory = meta.customer_category?.name || "N/A";
  const meteringType = meta.metering_type?.name || "N/A";

  const tariffRate = meta.tariff_rate
    ? formatCurrency(meta.tariff_rate)
    : "N/A";

  const address = location.address || "N/A";

  // ========================================
  // REUSABLE DETAIL ROW
  // ========================================

  const DetailRow = ({
    label,
    value,
    copyable = false,
  }: {
    label: string;
    value: string;
    copyable?: boolean;
  }) => (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-gray-500">
        {label}
      </span>

      <div className="flex min-w-0 items-start gap-1.5">
        <span className="break-all text-right text-sm font-medium text-gray-900">
          {value || "N/A"}
        </span>

        {copyable && value && value !== "N/A" && (
          <button
            type="button"
            onClick={() => copyToClipboard(value, label)}
            aria-label={`Copy ${label}`}
            className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-indigo-600"
          >
            {copiedField === label ? (
              <CheckCircle sx={{ fontSize: 16 }} className="text-green-500" />
            ) : (
              <ContentCopy sx={{ fontSize: 16 }} />
            )}
          </button>
        )}
      </div>
    </div>
  );

  // ========================================
  // COMPONENT UI
  // ========================================

  return (
    <div className="min-h-screen bg-[#F5F7FC] pb-24">

      {/* ================= HEADER ================= */}

      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 px-4 pb-3 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="-ml-2 rounded-full p-2 transition hover:bg-gray-100"
            >
              <ArrowBack className="text-gray-800" />
            </button>

            <div className="min-w-0">
              <h1 className="text-lg font-semibold leading-tight text-gray-900">
                Account details
              </h1>

              <p className="truncate text-xs text-gray-500">
                No. {accountNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              copyToClipboard(
                `Account: ${accountNumber}\nMeter: ${meterNumber}\nName: ${customerName}`,
                "Account information"
              );
            }}
            aria-label="Copy account information"
            className="rounded-full bg-gray-100 p-2.5 transition hover:bg-gray-200"
          >
            <IosShare
              className="text-gray-700"
              fontSize="small"
            />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-3 max-w-5xl space-y-4 px-4">

        {/* ================= ACCOUNT CARD ================= */}

        <section className="relative overflow-hidden rounded-2xl bg-gray-900 p-5 text-white shadow-sm">

          <div className="mb-1 flex items-start justify-between">
            <p className="text-sm text-gray-400">
              Account holder
            </p>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? "bg-gray-700 text-green-400"
                  : "bg-red-900/40 text-red-300"
              }`}
            >
              <CheckCircle sx={{ fontSize: 14 }} />

              {personal.account_status || "Unknown"}
            </span>
          </div>

          <h2 className="mb-1 break-words text-2xl font-bold tracking-tight">
            {customerName}
          </h2>

          <p className="mb-6 text-sm text-gray-400">
            {customerClass} customer
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {accountNumber}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Account no.
              </p>
            </div>

            <div className="min-w-0 border-x border-gray-700 px-1">
              <p className="truncate text-sm font-medium">
                {meterNumber}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Meter no.
              </p>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {formatCurrency(wallet.balance)}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Wallet
              </p>
            </div>

          </div>
        </section>

        {/* ================= INFO CARDS ================= */}

        <div className="grid grid-cols-3 gap-3">

          {/* Metering */}

          <div className="flex min-w-0 flex-col items-center rounded-2xl bg-white p-3 text-center shadow-sm sm:p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Bolt className="text-amber-500" fontSize="small" />
            </div>

            <p className="w-full truncate text-sm font-semibold text-gray-900">
              {meteringType}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Metering
            </p>
          </div>

          {/* Band */}

          <div className="flex min-w-0 flex-col items-center rounded-2xl bg-white p-3 text-center shadow-sm sm:p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <Speed className="text-indigo-500" fontSize="small" />
            </div>

            <p className="w-full truncate text-sm font-semibold text-gray-900">
              {meta.band || "N/A"}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Tariff band
            </p>
          </div>

          {/* Category */}

          <div className="flex min-w-0 flex-col items-center rounded-2xl bg-white p-3 text-center shadow-sm sm:p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Category className="text-emerald-500" fontSize="small" />
            </div>

            <p className="w-full truncate text-sm font-semibold text-gray-900">
              {customerCategory}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Category
            </p>
          </div>

        </div>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => router.push("/customer/bills/buypower")}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Bolt fontSize="small" />
            Buy power
          </button>

          <button
            type="button"
            onClick={() => router.push("/customer/bills")}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 font-medium text-gray-800 transition hover:bg-gray-50"
          >
            <Receipt fontSize="small" />
            Bills
          </button>

          <button
            type="button"
            onClick={() => router.push("/customer/transactions")}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 font-medium text-gray-800 transition hover:bg-gray-50"
          >
            <History fontSize="small" />
            History
          </button>

        </div>

        {/* ================= IDENTIFIERS ================= */}

        <section className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <VpnKey className="text-gray-700" fontSize="small" />

            <h3 className="font-semibold text-gray-900">
              Identifiers
            </h3>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Account number"
              value={accountNumber}
              copyable
            />

            <DetailRow
              label="Meter number"
              value={meterNumber}
              copyable
            />

            <DetailRow
              label="Customer ID"
              value={String(personal.id)}
            />

            <DetailRow
              label="Vending"
              value={isActive ? "Enabled" : "Disabled"}
            />
          </div>
        </section>

        {/* ================= CONTACT ================= */}

        <section className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <Person className="text-gray-700" fontSize="small" />

            <h3 className="font-semibold text-gray-900">
              Contact
            </h3>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Full name"
              value={personal.name || "N/A"}
            />

            <DetailRow
              label="Email"
              value={personal.email || "N/A"}
              copyable
            />

            <DetailRow
              label="Phone"
              value={personal.phone_number || "N/A"}
              copyable
            />

            <DetailRow
              label="Address"
              value={address}
            />
          </div>
        </section>

        {/* ================= CLASSIFICATION ================= */}

        <section className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <Layers className="text-gray-700" fontSize="small" />

            <h3 className="font-semibold text-gray-900">
              Classification
            </h3>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Customer class"
              value={customerClass}
            />

            <DetailRow
              label="Category"
              value={customerCategory}
            />

            <DetailRow
              label="Metering type"
              value={meteringType}
            />

            <DetailRow
              label="Tariff"
              value={meta.tariff || "N/A"}
            />

            <DetailRow
              label="Tariff rate"
              value={`${tariffRate} / kWh`}
            />

            <DetailRow
              label="Band"
              value={meta.band || "N/A"}
            />
          </div>
        </section>

        {/* ================= LOCATION ================= */}

        <section className="rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <LocationOn className="text-gray-700" fontSize="small" />

            <h3 className="font-semibold text-gray-900">
              Location
            </h3>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="District"
              value={location.district || "N/A"}
            />

            <DetailRow
              label="Feeder"
              value={location.feeder || "N/A"}
            />

            <DetailRow
              label="33kV Feeder"
              value={location.feeder_33 || "N/A"}
            />

            <DetailRow
              label="Transformer"
              value={location.transformer || "N/A"}
            />

            <DetailRow
              label="Service center"
              value={location.service_center || "N/A"}
            />

            <DetailRow
              label="Service unit"
              value={location.service_unit || "N/A"}
            />
          </div>
        </section>

        {/* ================= ACCOUNT STATUS ================= */}

        <section className="relative rounded-2xl bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center gap-2">
            <ShowChart className="text-gray-700" fontSize="small" />

            <h3 className="font-semibold text-gray-900">
              Account status
            </h3>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
              isActive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />

            {personal.account_status || "Unknown"}
          </div>

        </section>
      </div>
    </div>
  );
}