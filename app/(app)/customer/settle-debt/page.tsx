"use client";

import { useEffect, useState } from "react";

import {
    AccountBalanceWalletOutlined,
    CheckCircleOutlined,
    DiscountOutlined,
    ErrorOutlineOutlined,
    Refresh,
    Schedule,
    ReceiptLongOutlined,
    Bolt,
} from "@mui/icons-material";

import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Divider,
} from "@mui/material";

import {
    getDebtSettlementOffer,
    settleDebt,
    type DebtSettlements,
    type DebtPayoffResponse,
} from "@/app/services/debtService";

export default function DebtSettlement() {
    const [offers, setOffers] = useState<DebtSettlements[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedOffer, setSelectedOffer] =
        useState<DebtSettlements | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [paymentLoading, setPaymentLoading] =
        useState(false);

    const [paymentResult, setPaymentResult] =
        useState<DebtPayoffResponse | null>(null);

    const [error, setError] = useState("");

    const formatAmount = (
        value: string | number
    ) => {
        const amount = Number(value || 0);

        return amount.toLocaleString("en-NG", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (date: string) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatDateTime = (date: string) => {
        if (!date) return "-";

        return new Date(date).toLocaleString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    /**
     * Load available settlement offers
     */
    const loadOffers = async (
        showRefresh = false
    ) => {
        try {
            setError("");

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response =
                await getDebtSettlementOffer();

            console.log(
                "SETTLEMENT OFFERS:",
                response
            );

            setOffers(response ?? []);
        } catch (error) {
            console.error(
                "Failed to load settlement offers:",
                error
            );

            setOffers([]);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to load settlement offers."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOffers();
    }, []);

    /**
     * Open confirmation dialog
     */
    const handleSelectOffer = (
        offer: DebtSettlements
    ) => {
        setSelectedOffer(offer);
        setPaymentResult(null);
        setError("");
        setConfirmOpen(true);
    };

    /**
     * Pay selected settlement offer
     */
    const handleSettleDebt = async () => {
        if (!selectedOffer) {
            return;
        }

        try {
            setPaymentLoading(true);
            setError("");

            const response = await settleDebt({
                settlement_offer:
                    selectedOffer.reference,
            });

            console.log(
                "SETTLEMENT RESPONSE:",
                response
            );

            setPaymentResult(response);

            setConfirmOpen(false);

            /**
             * Remove the successfully paid offer
             * from the current list.
             */
            setOffers((currentOffers) =>
                currentOffers.filter(
                    (offer) =>
                        offer.reference !==
                        selectedOffer.reference
                )
            );
        } catch (error: any) {
            console.error(
                "Settlement payment failed:",
                error
            );

            /**
             * Backend can return 400 when the
             * settlement offer is no longer valid.
             */
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Unable to settle this debt. The settlement offer may no longer be valid.";

            setError(message);

            setConfirmOpen(false);
        } finally {
            setPaymentLoading(false);
        }
    };

    /**
     * Loading state
     */
    if (loading) {
        return (
            <section className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex min-h-[220px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <CircularProgress
                            size={30}
                            sx={{
                                color: "#6175f5",
                            }}
                        />

                        <p className="text-sm text-gray-500">
                            Loading settlement offers...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    /**
     * Successful settlement
     */
    if (paymentResult) {
        return (
            <section className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mx-auto flex max-w-lg flex-col items-center text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <CheckCircleOutlined
                            sx={{ fontSize: 38 }}
                        />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-[#1e293b]">
                        Debt settlement successful
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Your settlement payment has been
                        successfully processed.
                    </p>

                    <div className="mt-6 w-full rounded-2xl bg-[#f6f7fb] p-4">

                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                                Amount paid
                            </span>

                            <span className="font-bold text-[#1e293b]">
                                ₦
                                {formatAmount(
                                    paymentResult.amount
                                )}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                            <span className="text-sm text-gray-500">
                                Debt settled
                            </span>

                            <span className="font-bold text-green-600">
                                {paymentResult.settled
                                    ? "Yes"
                                    : "No"}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                            <span className="text-sm text-gray-500">
                                Discount
                            </span>

                            <span className="font-bold text-purple-600">
                                ₦
                                {formatAmount(
                                    paymentResult.discount
                                )}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                            <span className="text-sm text-gray-500">
                                Remaining debt
                            </span>

                            <span className="font-bold text-[#1e293b]">
                                ₦
                                {formatAmount(
                                    paymentResult.remaining_debt
                                )}
                            </span>
                        </div>

                    </div>

                    <div className="mt-5 w-full">
                        <p className="text-xs text-gray-400">
                            Transaction reference
                        </p>

                        <p className="mt-1 break-all text-xs font-semibold text-gray-600">
                            {
                                paymentResult.transaction_reference
                            }
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setPaymentResult(null);
                            loadOffers();
                        }}
                        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6175f5] text-sm font-semibold text-white transition hover:bg-[#4f63e6]"
                    >
                        <Refresh sx={{ fontSize: 18 }} />

                        View settlement offers
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="rounded-[20px] border border-gray-100 bg-white shadow-sm">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">

                    <div>
                        <div className="flex items-center gap-2">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                <AccountBalanceWalletOutlined
                                    sx={{ fontSize: 21 }}
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-[#1e293b]">
                                    Debt settlement
                                </h2>

                                <p className="text-xs text-gray-400">
                                    Settle your outstanding debt
                                    with an available discount.
                                </p>
                            </div>

                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={refreshing}
                        onClick={() =>
                            loadOffers(true)
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Refresh
                            sx={{
                                fontSize: 18,
                                animation: refreshing
                                    ? "spin 1s linear infinite"
                                    : "none",
                            }}
                        />

                        Refresh
                    </button>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="m-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">

                        <ErrorOutlineOutlined
                            sx={{ fontSize: 20 }}
                        />

                        <div className="flex-1">
                            <p className="font-medium">
                                Unable to process request
                            </p>

                            <p className="mt-1 text-xs">
                                {error}
                            </p>
                        </div>

                    </div>
                )}

                {/* OFFERS */}

                {offers.length === 0 ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-12 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <CheckCircleOutlined
                                sx={{
                                    fontSize: 32,
                                    color: "#94a3b8",
                                }}
                            />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-gray-900">
                            No settlement offers
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-gray-500">
                            You currently have no payable
                            debt settlement offers.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                loadOffers(true)
                            }
                            className="mt-5 flex items-center gap-2 rounded-xl bg-[#6175f5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4f63e6]"
                        >
                            <Refresh
                                sx={{ fontSize: 17 }}
                            />

                            Check again
                        </button>

                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">

                        {offers.map((offer) => {

                            const quotedBalance =
                                Number(
                                    offer.quoted_balance
                                );

                            const settlementAmount =
                                Number(
                                    offer.settlement_amount
                                );

                            const discountAmount =
                                Number(
                                    offer.discount_amount
                                );

                            const discount =
                                Math.abs(
                                    discountAmount
                                );

                            return (
                                <div
                                    key={
                                        offer.reference
                                    }
                                    className="p-5 transition hover:bg-gray-50/50"
                                >

                                    {/* OFFER HEADER */}

                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                                        <div className="flex items-start gap-3">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                                                <DiscountOutlined
                                                    sx={{
                                                        fontSize: 23,
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    Settlement offer
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Ref:{" "}
                                                    <span className="font-medium text-gray-500">
                                                        {
                                                            offer.reference
                                                        }
                                                    </span>
                                                </p>
                                            </div>

                                        </div>

                                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                            <CheckCircleOutlined
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            />

                                            Available
                                        </span>

                                    </div>

                                    {/* AMOUNTS */}

                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <p className="text-xs text-gray-400">
                                                Outstanding debt
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-gray-900">
                                                ₦
                                                {formatAmount(
                                                    quotedBalance
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-indigo-50 p-4">
                                            <p className="text-xs text-indigo-500">
                                                Settlement amount
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-indigo-600">
                                                ₦
                                                {formatAmount(
                                                    settlementAmount
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-green-50 p-4">
                                            <p className="text-xs text-green-600">
                                                Discount
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-green-600">
                                                ₦
                                                {formatAmount(
                                                    discount
                                                )}
                                            </p>
                                        </div>

                                    </div>

                                    {/* OFFER DETAILS */}

                                    <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">

                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Schedule
                                                sx={{
                                                    fontSize: 17,
                                                }}
                                            />

                                            <span>
                                                Quoted:{" "}
                                                {formatDate(
                                                    offer.quoted_at
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Schedule
                                                sx={{
                                                    fontSize: 17,
                                                }}
                                            />

                                            <span>
                                                Expires:{" "}
                                                {formatDateTime(
                                                    offer.expires_at
                                                )}
                                            </span>
                                        </div>

                                    </div>

                                    {/* DEBT LINES */}

                                    {offer.lines?.length >
                                        0 && (
                                            <div className="mt-5">

                                                <p className="mb-2 text-xs font-semibold text-gray-700">
                                                    Debt breakdown
                                                </p>

                                                <div className="overflow-hidden rounded-xl border border-gray-100">

                                                    {offer.lines.map(
                                                        (
                                                            line
                                                        ) => (
                                                            <div
                                                                key={`${offer.reference}-${line.debt_id}`}
                                                                className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                                                            >

                                                                <div className="flex items-center gap-2">

                                                                    <Bolt
                                                                        sx={{
                                                                            fontSize: 17,
                                                                            color: "#f59e0b",
                                                                        }}
                                                                    />

                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-700">
                                                                            {
                                                                                line.bucket
                                                                            }
                                                                        </p>

                                                                        <p className="text-[11px] text-gray-400">
                                                                            Debt ID:{" "}
                                                                            {
                                                                                line.debt_id
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                </div>

                                                                <div className="flex gap-4 text-xs">

                                                                    <div>
                                                                        <p className="text-gray-400">
                                                                            Outstanding
                                                                        </p>

                                                                        <p className="font-semibold text-gray-700">
                                                                            ₦
                                                                            {formatAmount(
                                                                                line.outstanding
                                                                            )}
                                                                        </p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-gray-400">
                                                                            Paid
                                                                        </p>

                                                                        <p className="font-semibold text-green-600">
                                                                            ₦
                                                                            {formatAmount(
                                                                                line.paid_portion
                                                                            )}
                                                                        </p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-gray-400">
                                                                            Waived
                                                                        </p>

                                                                        <p className="font-semibold text-purple-600">
                                                                            ₦
                                                                            {formatAmount(
                                                                                line.waived_portion
                                                                            )}
                                                                        </p>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                    {/* ACTION */}

                                    <div className="mt-5 flex justify-end">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSelectOffer(
                                                    offer
                                                )
                                            }
                                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6175f5] px-5 text-sm font-semibold text-white transition hover:bg-[#4f63e6] sm:w-auto"
                                        >
                                            <AccountBalanceWalletOutlined
                                                sx={{
                                                    fontSize: 18,
                                                }}
                                            />

                                            Settle now · ₦
                                            {formatAmount(
                                                settlementAmount
                                            )}
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </section>

            {/* CONFIRMATION DIALOG */}

            <Dialog
                open={confirmOpen}
                onClose={() => {
                    if (!paymentLoading) {
                        setConfirmOpen(false);
                    }
                }}
                fullWidth
                maxWidth="xs"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "22px",
                            overflow: "hidden",
                        },
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        px: 3,
                        pt: 3,
                        pb: 1,
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#1e293b",
                    }}
                >
                    Confirm debt settlement
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>

                    {selectedOffer && (
                        <div className="space-y-4">

                            <div className="rounded-2xl bg-[#f6f7fb] p-5 text-center">

                                <p className="text-xs text-gray-500">
                                    Amount to pay
                                </p>

                                <p className="mt-1 text-3xl font-bold text-[#1e293b]">
                                    ₦
                                    {formatAmount(
                                        selectedOffer.settlement_amount
                                    )}
                                </p>

                            </div>

                            <div className="overflow-hidden rounded-2xl border border-gray-100">

                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500">
                                        Original debt
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        ₦
                                        {formatAmount(
                                            selectedOffer.quoted_balance
                                        )}
                                    </span>
                                </div>

                                <Divider />

                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500">
                                        Discount
                                    </span>

                                    <span className="font-semibold text-green-600">
                                        ₦
                                        {formatAmount(
                                            Math.abs(
                                                Number(
                                                    selectedOffer.discount_amount
                                                )
                                            )
                                        )}
                                    </span>
                                </div>

                                <Divider />

                                <div className="flex justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500">
                                        Remaining debt
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        ₦0
                                    </span>
                                </div>

                            </div>

                            <div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                                By confirming, your wallet will
                                be debited{" "}
                                <strong>
                                    ₦
                                    {formatAmount(
                                        selectedOffer.settlement_amount
                                    )}
                                </strong>
                                . The settlement offer will
                                close the debt in full.
                            </div>

                            <p className="text-[11px] text-gray-400">
                                Offer expires:{" "}
                                {formatDateTime(
                                    selectedOffer.expires_at
                                )}
                            </p>

                        </div>
                    )}

                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        pt: 1,
                        gap: 1,
                    }}
                >

                    <Button
                        fullWidth
                        variant="outlined"
                        disabled={paymentLoading}
                        onClick={() =>
                            setConfirmOpen(false)
                        }
                        sx={{
                            height: 46,
                            borderRadius: "13px",
                            borderColor: "#e2e8f0",
                            color: "#475569",
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={paymentLoading}
                        onClick={handleSettleDebt}
                        sx={{
                            height: 46,
                            borderRadius: "13px",
                            backgroundColor:
                                "#6175f5",
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor:
                                    "#4f63e6",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {paymentLoading ? (
                            <span className="flex items-center gap-2">
                                <CircularProgress
                                    size={17}
                                    sx={{
                                        color: "white",
                                    }}
                                />

                                Processing...
                            </span>
                        ) : (
                            "Confirm settlement"
                        )}
                    </Button>

                </DialogActions>

            </Dialog>
        </>
    );
}