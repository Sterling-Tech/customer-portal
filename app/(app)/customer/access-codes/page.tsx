"use client";

import { useEffect, useState } from "react";

import {
  Add,
  ContentCopy,
  CheckCircleOutlined,
  AccessTimeOutlined,
  PersonOutlined,
  PhoneOutlined,
  DeleteOutlined,
  Refresh,
  Close,
  ConfirmationNumberOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  generateAccessCode,
  getAccessCodes,
  revokeAccessCode,
  type AccessCodePayload,
  type AccessCodeResponse,
} from "@/app/services/accessCode";

export default function VisitorAccessCodes() {
  const [accessCodes, setAccessCodes] = useState<
    AccessCodeResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [duration, setDuration] = useState("30");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [copiedCode, setCopiedCode] = useState<string | null>(
    null
  );

  const [revokeTarget, setRevokeTarget] =
    useState<AccessCodeResponse | null>(null);

  const [revoking, setRevoking] = useState(false);

  // =========================================================
  // LOAD ACCESS CODES
  // =========================================================

  // const loadAccessCodes = async (
  //   showRefreshLoader = false
  // ) => {
  //   try {
  //     setError("");

  //     if (showRefreshLoader) {
  //       setRefreshing(true);
  //     } else {
  //       setLoading(true);
  //     }

  //     const response = await getAccessCodes();

  //     setAccessCodes(response || []);
  //   } catch (err) {
  //     console.error("Failed to load access codes:", err);

  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : "Unable to load visitor access codes."
  //     );
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };
  const loadAccessCodes = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getAccessCodes();

    setAccessCodes(response);
  } catch (error: any) {
    console.error("Failed to load access codes:", error);

    setAccessCodes([]);

    setError(
      error?.response?.data?.detail ||
        error?.message ||
        "Failed to load access codes."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadAccessCodes();
  }, []);

  // =========================================================
  // GENERATE CODE
  // =========================================================

  const handleGenerateCode = async () => {
    setError("");
    setSuccess("");

    const trimmedName = visitorName.trim();
    const trimmedPhone = visitorPhone.trim();
    const durationMinutes = Number(duration);

    if (!trimmedName) {
      setError("Please enter the visitor's name.");
      return;
    }

    if (!trimmedPhone) {
      setError("Please enter the visitor's phone number.");
      return;
    }

    if (!durationMinutes || durationMinutes <= 0) {
      setError("Please enter a valid duration.");
      return;
    }

    try {
      setSubmitting(true);

      const payload: AccessCodePayload = {
        visitor_name: trimmedName,
        visitor_phone: trimmedPhone,
        duration_minutes: durationMinutes,
      };

      const response = await generateAccessCode(payload);

      // Add newly generated code to the beginning
      setAccessCodes((prev) => [
        response,
        ...prev,
      ]);

      setSuccess(
        "Visitor access code generated successfully."
      );

      // Reset form
      setVisitorName("");
      setVisitorPhone("");
      setDuration("30");

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to generate access code:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate access code."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // COPY CODE
  // =========================================================

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // =========================================================
  // REVOKE CODE
  // =========================================================

  const handleRevoke = async () => {
    if (!revokeTarget) {
      return;
    }

    try {
      setRevoking(true);
      setError("");

      const response = await revokeAccessCode(
        revokeTarget.id
      );

      // Replace the old code with revoked response
      setAccessCodes((prev) =>
        prev.map((item) =>
          item.id === response.id
            ? response
            : item
        )
      );

      setRevokeTarget(null);

      setSuccess(
        "Visitor access code revoked successfully."
      );
    } catch (err) {
      console.error("Failed to revoke access code:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to revoke this access code."
      );
    } finally {
      setRevoking(false);
    }
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (item: AccessCodeResponse) => {
    if (item.revoked_at || item.status === "revoked") {
      return "revoked";
    }

    if (item.used_at || item.status === "used") {
      return "used";
    }

    if (
      item.expires_at &&
      new Date(item.expires_at).getTime() <
        Date.now()
    ) {
      return "expired";
    }

    return "active";
  };

  const getStatusClasses = (
    status: string
  ) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700";

      case "used":
        return "bg-blue-50 text-blue-700";

      case "expired":
        return "bg-gray-100 text-gray-500";

      case "revoked":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <CircularProgress
            size={30}
            sx={{ color: "#6175f5" }}
          />

          <p className="text-sm text-gray-500">
            Loading visitor access codes...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-3 sm:p-5">
      <div className="mx-auto w-full max-w-5xl">

        {/* HEADER */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef0ff] text-[#6175f5]">
                <ConfirmationNumberOutlined
                  sx={{ fontSize: 22 }}
                />
              </div>

              <div>
                <h1 className="text-lg font-bold text-[#1e293b]">
                  Visitor access
                </h1>

                <p className="text-xs text-gray-500">
                  Generate and manage visitor access codes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => loadAccessCodes()}
              disabled={refreshing}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <Refresh
                sx={{
                  fontSize: 18,
                  ...(refreshing
                    ? {
                        animation:
                          "spin 1s linear infinite",
                      }
                    : {}),
                }}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setModalOpen(true);
              }}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6175f5] px-4 text-sm font-semibold text-white transition hover:bg-[#4f63e6]"
            >
              <Add sx={{ fontSize: 18 }} />

              Generate code
            </button>

          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <WarningAmberOutlined
              sx={{ fontSize: 18 }}
            />

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
            >
              <Close sx={{ fontSize: 17 }} />
            </button>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircleOutlined
              sx={{ fontSize: 18 }}
            />

            <span>{success}</span>
          </div>
        )}

        {/* INFO CARD */}

        <section className="mb-5 rounded-2xl border border-[#edf0f5] bg-white p-4 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <PersonOutlined
                sx={{ fontSize: 21 }}
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">
                How visitor access works
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Generate a single-use six-digit access code
                for your visitor. Share the code with them.
                Security will verify the code at the gate,
                and the code will be used once after admission.
              </p>
            </div>

          </div>
        </section>

        {/* CONTENT */}

        <section className="rounded-2xl border border-[#edf0f5] bg-white shadow-sm">

          {/* SECTION HEADER */}

          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">

            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">
                Access codes
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                {accessCodes.length} code
                {accessCodes.length === 1
                  ? ""
                  : "s"}
              </p>
            </div>

          </div>

          {/* EMPTY STATE */}

          {accessCodes.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef0ff] text-[#6175f5]">
                <ConfirmationNumberOutlined
                  sx={{ fontSize: 32 }}
                />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#1e293b]">
                No visitor codes yet
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Generate an access code when you want
                to give a visitor temporary access.
              </p>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-5 flex h-10 items-center gap-2 rounded-xl bg-[#6175f5] px-4 text-sm font-semibold text-white hover:bg-[#4f63e6]"
              >
                <Add sx={{ fontSize: 18 }} />
                Generate code
              </button>

            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {accessCodes.map((item) => {
                const status = getStatus(item);

                return (
                  <div
                    key={item.id}
                    className="p-4 transition hover:bg-gray-50/70"
                  >

                    {/* TOP */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex min-w-0 gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-[#6175f5]">
                          <PersonOutlined
                            sx={{ fontSize: 22 }}
                          />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-sm font-bold text-[#1e293b]">
                              {item.visitor_name}
                            </h3>

                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusClasses(
                                status
                              )}`}
                            >
                              {status}
                            </span>

                          </div>

                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <PhoneOutlined
                              sx={{ fontSize: 14 }}
                            />

                            {item.visitor_phone}
                          </div>

                        </div>
                      </div>

                      {/* CODE */}

                      <div className="flex items-center gap-2 rounded-xl bg-[#f6f7fb] px-3 py-2">

                        <span className="text-lg font-bold tracking-[0.25em] text-[#1e293b]">
                          {item.code}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCode(item.code)
                          }
                          disabled={status !== "active"}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-[#6175f5] disabled:cursor-not-allowed disabled:opacity-40"
                          title="Copy access code"
                        >
                          {copiedCode === item.code ? (
                            <CheckCircleOutlined
                              sx={{
                                fontSize: 17,
                                color: "#16a34a",
                              }}
                            />
                          ) : (
                            <ContentCopy
                              sx={{ fontSize: 17 }}
                            />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

                      <div className="rounded-xl bg-[#f8fafc] px-3 py-2.5">

                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                          Created
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-700">
                          {formatDate(item.created_at)}
                        </p>

                      </div>

                      <div className="rounded-xl bg-[#f8fafc] px-3 py-2.5">

                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                          Expires
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">

                          <AccessTimeOutlined
                            sx={{ fontSize: 14 }}
                          />

                          {formatDate(item.expires_at)}

                        </div>

                      </div>

                      <div className="rounded-xl bg-[#f8fafc] px-3 py-2.5">

                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                          Used
                        </p>

                        <p className="mt-1 text-xs font-medium text-gray-700">
                          {item.used_at
                            ? formatDate(item.used_at)
                            : "Not used"}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    {status === "active" && (
                      <div className="mt-3 flex justify-end">

                        <button
                          type="button"
                          onClick={() =>
                            setRevokeTarget(item)
                          }
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <DeleteOutlined
                            sx={{ fontSize: 16 }}
                          />

                          Revoke code
                        </button>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </div>

      {/* ===================================================== */}
      {/* GENERATE MODAL */}
      {/* ===================================================== */}

      <Dialog
        open={modalOpen}
        onClose={() => {
          if (!submitting) {
            setModalOpen(false);
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
          Generate visitor code
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>

          <div className="space-y-4">

            {/* Visitor name */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1e293b]">
                Visitor name
              </label>

              <input
                type="text"
                value={visitorName}
                onChange={(e) =>
                  setVisitorName(e.target.value)
                }
                placeholder="Enter visitor's name"
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-[#6175f5] focus:bg-white disabled:opacity-60"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1e293b]">
                Visitor phone number
              </label>

              <div className="flex h-11 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#6175f5] focus-within:bg-white">

                <PhoneOutlined
                  sx={{
                    fontSize: 18,
                    color: "#94a3b8",
                  }}
                />

                <input
                  type="tel"
                  value={visitorPhone}
                  onChange={(e) =>
                    setVisitorPhone(
                      e.target.value
                    )
                  }
                  placeholder="08012345678"
                  disabled={submitting}
                  className="ml-2 w-full bg-transparent text-sm outline-none disabled:opacity-60"
                />

              </div>
            </div>

            {/* Duration */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1e293b]">
                Access duration
              </label>

              <div className="relative">

                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  disabled={submitting}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 pr-20 text-sm outline-none focus:border-[#6175f5] focus:bg-white disabled:opacity-60"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  minutes
                </span>

              </div>

              <p className="mt-1.5 text-[11px] text-gray-400">
                The code will stop working after this
                duration.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

          </div>

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
            disabled={submitting}
            onClick={() => setModalOpen(false)}
            sx={{
              height: 44,
              borderRadius: "12px",
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
            disabled={
              submitting ||
              !visitorName.trim() ||
              !visitorPhone.trim() ||
              !duration ||
              Number(duration) <= 0
            }
            onClick={handleGenerateCode}
            sx={{
              height: 44,
              borderRadius: "12px",
              backgroundColor: "#6175f5",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#4f63e6",
                boxShadow: "none",
              },
            }}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <CircularProgress
                  size={17}
                  sx={{ color: "white" }}
                />

                Generating...
              </span>
            ) : (
              "Generate code"
            )}
          </Button>

        </DialogActions>

      </Dialog>

      {/* ===================================================== */}
      {/* REVOKE MODAL */}
      {/* ===================================================== */}

      <Dialog
        open={Boolean(revokeTarget)}
        onClose={() => {
          if (!revoking) {
            setRevokeTarget(null);
          }
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "22px",
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
          Revoke access code?
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>

          {revokeTarget && (
            <div className="space-y-3">

              <p className="text-sm leading-6 text-gray-500">
                Are you sure you want to revoke the visitor
                access code for{" "}
                <strong className="text-gray-700">
                  {revokeTarget.visitor_name}
                </strong>
                ?
              </p>

              <div className="rounded-xl bg-red-50 px-4 py-3 text-center">

                <p className="text-xs text-red-500">
                  Access code
                </p>

                <p className="mt-1 text-xl font-bold tracking-[0.3em] text-red-700">
                  {revokeTarget.code}
                </p>

              </div>

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
            disabled={revoking}
            onClick={() => setRevokeTarget(null)}
            sx={{
              height: 44,
              borderRadius: "12px",
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
            disabled={revoking}
            onClick={handleRevoke}
            sx={{
              height: 44,
              borderRadius: "12px",
              backgroundColor: "#dc2626",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#b91c1c",
                boxShadow: "none",
              },
            }}
          >
            {revoking ? (
              <span className="flex items-center gap-2">
                <CircularProgress
                  size={17}
                  sx={{ color: "white" }}
                />

                Revoking...
              </span>
            ) : (
              "Revoke code"
            )}
          </Button>

        </DialogActions>

      </Dialog>
    </main>
  );
}