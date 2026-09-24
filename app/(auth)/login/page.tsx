
"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ==========================
// GOOGLE ICON
// ==========================

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
    />

    <path
      fill="#34A853"
      d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.75Z"
    />

    <path
      fill="#FBBC05"
      d="M6.53 13.84A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.3-1.84V7.63H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.37l3.25-2.53Z"
    />

    <path
      fill="#EA4335"
      d="M12 6.13c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.21 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.38l3.25 2.53C7.3 7.85 9.46 6.13 12 6.13Z"
    />
  </svg>
);

// ==========================
// LOGIN PAGE
// ==========================

export default function CustomerLogin() {
  const router = useRouter();

  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // HANDLE LOGIN
  // ==========================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!accountNumber.trim() || !password) {
      setError("Please enter your account number and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
  identifier: accountNumber.trim(),
  password,
  redirect: false,
});

console.log("NEXTAUTH SIGN IN RESULT:", result);

if (result?.ok) {
  router.replace("/customer/dashboard");
  router.refresh();
  return;
}

if (result?.error && result.error !== "undefined") {
  setError(result.error);
  return;
}

setError("Unable to log in. Please try again.");
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UI
  // ==========================

  return (
    <main className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[390px]">

        {/* Logo */}

        <div className="flex justify-center mb-5">
          <div className="h-12 w-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
            <img
              src="/logo.svg"
              alt="Company logo"
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>

        {/* Heading */}

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">
            Sign in to account
          </h1>

          <p className="mt-2 text-sm leading-5 text-[#64748b] max-w-[300px] mx-auto">
            Enter your account details below to log in and
            manage your services seamlessly.
          </p>
        </div>

        {/* Error Message */}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Login Form */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Account Number */}

          <div>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value)
              }
              placeholder="Account Number / Meter Number"
              autoComplete="username"
              required
              disabled={loading}
              className="w-full h-12 px-4 rounded-full border border-[#dce1e8] bg-white text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition disabled:opacity-60"
            />
          </div>

          {/* Password */}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full h-12 px-4 pr-16 rounded-full border border-[#dce1e8] bg-white text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2563eb] hover:text-blue-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Forgot Password */}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#2563eb] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-[#2864e8] hover:bg-[#1d58d8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-[0_3px_6px_rgba(37,99,235,0.25)] transition active:scale-[0.99]"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-[#e1e5eb] flex-1" />

          <span className="text-xs text-[#94a3b8]">
            Or
          </span>

          <div className="h-px bg-[#e1e5eb] flex-1" />
        </div>

        {/* Google Login */}

        <button
          type="button"
          onClick={() => {
            setError(
              "Google sign-in is not configured yet."
            );
          }}
          className="w-full h-12 rounded-full bg-white border border-[#dce1e8] flex items-center justify-center gap-2 text-sm font-semibold text-[#1e293b] hover:bg-gray-50 transition"
        >
          <GoogleIcon />

          <span>Sign in with Google</span>
        </button>

        {/* Guest Payment */}

        <button
          type="button"
          onClick={() => router.push("/pay-bill")}
          className="mt-3 w-full h-12 rounded-full bg-[#0f172a] hover:bg-[#172033] text-white flex items-center justify-center gap-2 shadow-[0_3px_6px_rgba(15,23,42,0.2)] transition"
        >
          <span className="text-sm">⚡</span>

          <span className="text-sm font-semibold">
            Pay a bill
          </span>

          <span className="text-xs text-gray-300">
            No login needed
          </span>
        </button>

        {/* Signup */}

        <p className="mt-6 text-center text-sm text-[#64748b]">
          Don&apos;t have an account?{" "}

          <Link
            href="/signup"
            className="font-semibold text-[#2563eb] hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </main>
  );
}