
"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRounded } from "@mui/icons-material";


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
          <div className="h-20 w-32 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
            <img
              src="/sterlingLogo2.jpeg"
              alt="Company logo"
              className="h-20 w-20 object-contain"
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

          {/* <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#2563eb] hover:underline"
            >
              Forgot password?
            </Link>
          </div> */}

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
          onClick={() => router.push("/access-code")}
          className="w-full h-12 rounded-full bg-white border border-[#dce1e8] flex items-center justify-center gap-2 text-sm font-semibold text-[#1e293b] hover:bg-gray-50 transition"
        >
          <KeyRounded className="text-blue-800 mr-3 hover:bg-indigo-800 hover:rounded-full hover:text-white hover:scale-110 transition-transform duration-200"/>

          <p className="font-bold text-lg">Get access <span className="text-black/60 ml-3 font-light">Security</span></p>
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