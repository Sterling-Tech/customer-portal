"use client";

import React, { useState, useRef } from "react";
import {
    CloseRounded,
    ReceiptLongOutlined,
    CalendarMonthOutlined,
    AccountBalanceWalletOutlined,
    ElectricMeterOutlined,
    PaymentsOutlined,
    BoltOutlined,
    InfoOutlined,
} from "@mui/icons-material";
import { Bill } from "@/app/services/billsService";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

interface BillDetailsProps {
    bill: Bill | null;
    onClose: () => void;
}

const formatCurrency = (value: string | number | null | undefined) => {
    const amount = Number(value ?? 0);

    if (!Number.isFinite(amount)) return "₦0.00";

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const formatNumber = (value: string | number | null | undefined) => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "N/A";

    return number.toLocaleString("en-NG", {
        maximumFractionDigits: 4,
    });
};

const formatDate = (value: string | null | undefined) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatLabel = (value: string | null | undefined) => {
    if (!value) return "N/A";

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                {value ?? "N/A"}
            </p>
        </div>
    );
}

function Section({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-indigo-600">{icon}</span>
                <h3 className="font-bold text-gray-900">{title}</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </section>
    );
}

export default function BillDetails({
    bill,
    onClose,
}: BillDetailsProps) {
    if (!bill) return null;

    const [shareMessage, setShareMessage] = useState("");

    const billPeriod = `${bill.month_name} ${bill.year}`;

    const shareText = `
    BILL STATEMENT

    Bill ID: ${bill.id}
    Billing Period: ${billPeriod}
    Account Number: ${bill.account_number}
    Feeder: ${bill.feeder}
    Customer Class: ${bill.customer_class}
    Tariff: ${bill.tariff_name}
    Previous Reading: ${bill.previous_read}
    Current Reading: ${bill.current_read}
    Units Consumed: ${bill.read_value} kWh

    Total Amount Due: ${formatCurrency(bill.charge?.total_due)}

    Bill Status: ${bill.status?.toUpperCase()}
    Generated: ${formatDate(bill.created_at)}

    Shared from Customer Portal.
    `;

    // const handleDownload = () => {
    //     window.print();
    // };

    const handleShare = async () => {
        setShareMessage("");

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Bill Statement - ${billPeriod}`,
                    text: shareText,
                });
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareText);
                setShareMessage("Bill details copied. You can now share them.");
            } else {
                window.prompt("Copy your bill details:", shareText);
            }
        } catch (error) {
            // Ignore cancellation when the user closes the native share menu.
            if (error instanceof Error && error.name !== "AbortError") {
                setShareMessage("Unable to share the bill. Please try again.");
            }
        }
    };

    const billRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

//   const handleDownload = async () => {
//     if (!billRef.current) return;

//     try {
//       setDownloading(true);

//       const html2pdf = (await import("html2pdf.js")).default;

//       const options = {
//         margin: [10, 10, 10, 10] as [number, number, number, number],
//         filename: `Bill-${bill.id}-${bill.month_name}-${bill.year}.pdf`,
//         image: {
//           type: "jpeg",
//           quality: 0.98,
//         },
//         html2canvas: {
//           scale: 2,
//           useCORS: true,
//           logging: false,
//           backgroundColor: "#ffffff",
//           scrollY: 0,
//         },
//         jsPDF: {
//           unit: "mm",
//           format: "a4",
//           orientation: "portrait",
//         },
//         pagebreak: {
//           mode: ["css", "legacy"],
//           avoid: [".bill-section", ".bill-detail-row"],
//         },
//       };

//       await html2pdf()
//         .set(options as any)
//         .from(billRef.current)
//         .save();
//     } catch (error) {
//       console.error("PDF download error:", error);
//       setShareMessage("Unable to download bill. Please try again.");
//     } finally {
//       setDownloading(false);
//     }
//   };


const handleDownload = async () => {
  if (!billRef.current) return;

  try {
    setDownloading(true);

    const source = billRef.current;

    // Create a sanitized clone for PDF export
    const clone = source.cloneNode(true) as HTMLElement;

    // Remove Tailwind classes that may contain unsupported CSS color functions
    clone.className = "bill-pdf-content";
    clone.style.width = "794px";
    clone.style.maxWidth = "794px";
    clone.style.padding = "24px";
    clone.style.background = "#ffffff";
    clone.style.color = "#111827";
    clone.style.fontFamily = "Arial, sans-serif";

    clone.querySelectorAll("*").forEach((el) => {
      const node = el as HTMLElement;

      // Remove Tailwind classes
      node.removeAttribute("class");

      // Reset to plain, PDF-safe styles
      node.style.background = "transparent";
      node.style.color = "#111827";
      node.style.borderColor = "#e5e7eb";
      node.style.boxShadow = "none";
      node.style.borderRadius = "0";
      node.style.fontFamily = "Arial, sans-serif";
    });

    document.body.appendChild(clone);

    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Bill-${bill.id}-${bill.month_name}-${bill.year}.pdf`,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [".bill-section", ".bill-detail-row"],
      },
    };

    await html2pdf()
      .set(options as any)
      .from(clone)
      .save();

    clone.remove();
  } catch (error) {
    console.error("PDF download error:", error);
    setShareMessage("Unable to download bill. Please try again.");
  } finally {
    setDownloading(false);
  }
};


    const charge = bill.charge;

    const statusClasses: Record<string, string> = {
        paid: "bg-green-50 text-green-700",
        settled: "bg-green-50 text-green-700",
        draft: "bg-orange-50 text-orange-700",
        pending: "bg-yellow-50 text-yellow-700",
        overdue: "bg-red-50 text-red-700",
    };

    const statusClass =
        statusClasses[bill.status?.toLowerCase()] ??
        "bg-gray-100 text-gray-700";

    return (

        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="bill-details-title"
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <ReceiptLongOutlined sx={{ fontSize: 24 }} />
                        </div>

                        <div>
                            <h2
                                id="bill-details-title"
                                className="text-lg font-bold text-gray-900"
                            >
                                Bill Details
                            </h2>
                            <p className="mt-0.5 text-xs text-gray-500">
                                Bill ID: {bill.id}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close bill details"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <CloseRounded />
                    </button>
                </div>

                {/* Scrollable content */}
                <div ref={billRef} className="overflow-y-auto p-5 sm:p-7">
                    {/* Bill overview */}
                    <div className="mb-7 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Billing period</p>

                                <h3 className="mt-1 text-xl font-bold text-gray-900">
                                    {bill.month_name} {bill.year}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {bill.account_number} · {bill.feeder}
                                </p>

                                <span
                                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                                >
                                    {formatLabel(bill.status)}
                                </span>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-sm text-gray-500">Total due</p>
                                <p className="mt-1 text-3xl font-bold text-indigo-600">
                                    {formatCurrency(charge?.total_due)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Bill reference #{bill.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* General information */}
                    <div className="space-y-7">
                        <Section
                            title="General information"
                            icon={<InfoOutlined />}
                        >
                            <DetailItem label="Bill ID" value={bill.id} />
                            <DetailItem
                                label="Billing period"
                                value={`${bill.month_name} ${bill.year}`}
                            />
                            <DetailItem
                                label="Account number"
                                value={bill.account_number}
                            />
                            <DetailItem
                                label="Customer class"
                                value={bill.customer_class}
                            />
                            <DetailItem
                                label="Bill type"
                                value={formatLabel(bill.bill_type)}
                            />
                            <DetailItem
                                label="Metering type"
                                value={formatLabel(bill.type)}
                            />
                            <DetailItem
                                label="Status"
                                value={formatLabel(bill.status)}
                            />
                            <DetailItem
                                label="Created at"
                                value={formatDate(bill.created_at)}
                            />
                            <DetailItem
                                label="Feeder"
                                value={bill.feeder}
                            />
                        </Section>

                        <div className="border-t border-gray-100" />

                        {/* Meter information */}
                        <Section
                            title="Meter readings and consumption"
                            icon={<ElectricMeterOutlined />}
                        >
                            <DetailItem
                                label="Previous reading"
                                value={`${formatNumber(bill.previous_read)} kWh`}
                            />
                            <DetailItem
                                label="Current reading"
                                value={`${formatNumber(bill.current_read)} kWh`}
                            />
                            <DetailItem
                                label="Reading value"
                                value={`${formatNumber(bill.read_value)} kWh`}
                            />
                            <DetailItem
                                label="Rollover value"
                                value={formatNumber(bill.rollover_value)}
                            />
                            <DetailItem
                                label="Stored value"
                                value={formatNumber(bill.stored_value)}
                            />
                            <DetailItem
                                label="Read mode"
                                value={formatLabel(bill.read_mode)}
                            />
                            <DetailItem
                                label="Consumed energy"
                                value={`${formatNumber(bill.consumed_kwh)} kWh`}
                            />
                            <DetailItem
                                label="Average consumption"
                                value={`${formatNumber(bill.average)} kWh`}
                            />
                            <DetailItem
                                label="Estimated consumption"
                                value={`${formatNumber(bill.estimated)} kWh`}
                            />
                        </Section>

                        <div className="border-t border-gray-100" />

                        {/* Tariff information */}
                        <Section
                            title="Tariff information"
                            icon={<BoltOutlined />}
                        >
                            <DetailItem
                                label="Tariff name"
                                value={bill.tariff_name}
                            />
                            <DetailItem
                                label="Tariff rate"
                                value={`${formatCurrency(bill.tariff_rate)} / kWh`}
                            />
                            <DetailItem
                                label="Band"
                                value={bill.band}
                            />
                            <DetailItem
                                label="Discount"
                                value={`${formatNumber(bill.discount)}%`}
                            />
                        </Section>

                        <div className="border-t border-gray-100" />

                        {/* Charges */}
                        <Section
                            title="Bill charges and payments"
                            icon={<PaymentsOutlined />}
                        >
                            <DetailItem
                                label="Monthly due"
                                value={formatCurrency(charge?.month_due)}
                            />
                            <DetailItem
                                label="Billed amount"
                                value={formatCurrency(charge?.billed_amount)}
                            />
                            <DetailItem
                                label="VAT"
                                value={formatCurrency(charge?.vat)}
                            />
                            <DetailItem
                                label="Total bill"
                                value={formatCurrency(charge?.total_bill)}
                            />
                            <DetailItem
                                label="Previous balance"
                                value={formatCurrency(charge?.previous_balance)}
                            />
                            <DetailItem
                                label="Last payment"
                                value={formatCurrency(charge?.last_payment)}
                            />
                            <DetailItem
                                label="Total paid"
                                value={formatCurrency(charge?.total_paid)}
                            />
                            <DetailItem
                                label="Net arrears"
                                value={formatCurrency(charge?.net_arrears)}
                            />
                            <DetailItem
                                label="Total due"
                                value={formatCurrency(charge?.total_due)}
                            />
                        </Section>
                    </div>

                    {/* Information note */}
                    <div className="mt-7 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <InfoOutlined
                            className="mt-0.5 shrink-0 text-blue-600"
                            sx={{ fontSize: 20 }}
                        />

                        <p className="text-xs leading-5 text-blue-800">
                            This information is displayed from the bill record already
                            retrieved from your account. No additional bill details
                            request is made.
                        </p>
                    </div>
                </div>

                {/* action buttons */}
                <div className="flex justify-between border-t border-gray-100 px-5 py-8 sm:px-7">
                    <div>
                        <div className="bill-actions flex flex-wrap gap-3">
                            {/* <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
                            >
                                <PrintOutlinedIcon fontSize="small" />
                                Print / Download PDF
                            </button> */}

                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {downloading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <PrintOutlinedIcon fontSize="small" />
                                        Download Bill
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700 px-5 py-3 text-sm font-medium text-green-700 transition hover:bg-green-50"
                            >
                                <ShareOutlinedIcon fontSize="small" />
                                Share Bill
                            </button>
                        </div>

                        {shareMessage && (
                            <p className="mt-3 text-sm text-gray-600" role="status">
                                {shareMessage}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div >
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}