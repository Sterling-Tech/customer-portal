"use client";

import { signUp } from "@/app/services/authService";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CustomerSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await signUp(formData);

      console.log("Signup successful:", response.customer);

      setSuccess("Account created successfully.");

      // Optional: Redirect to login page after successful signup
      router.push("/login");
    } catch (err: any) {
      const apiError = err.response?.data;

      setError(
        apiError?.message ||
          apiError?.detail ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-[#111827]">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-5 text-[#64748b]">
            Enter your details below to register and
            manage your services seamlessly.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Account Number */}
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
           placeholder="Account Number / Meter Number"
            autoComplete="username"
            required
            className="w-full h-12 px-4 rounded-full border border-[#dce1e8] bg-white text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            autoComplete="email"
            required
            className="w-full h-12 px-4 rounded-full border border-[#dce1e8] bg-white text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="new-password"
              required
              className="w-full h-12 px-4 pr-16 rounded-full border border-[#dce1e8] bg-white text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2563eb]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
            className="w-full h-12 px-4 rounded-full border border-[#dce1e8] bg-white text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-[#2864e8] hover:bg-[#1d58d8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-[0_3px_6px_rgba(37,99,235,0.25)] transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-[#64748b]">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#2563eb] hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}