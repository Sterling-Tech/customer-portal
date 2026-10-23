"use client";

import { FormEvent, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

import {
    ArrowBack,
    EmailOutlined,
    LockOutlined,
    Shield,
    InfoOutlined,
} from "@mui/icons-material";

import { useRouter } from "next/navigation";
import axios from "axios";
import { securityLogin } from "@/app/services/authService";


interface GateSignInProps {
    onSignIn?: (email: string, password: string) => void;
    onBack?: () => void;
    onBackToCustomer?: () => void;
}

export default function GateSignIn({
    onSignIn,
    onBack,
    onBackToCustomer,
}: GateSignInProps) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await securityLogin({
                email: email.trim(),
                password,
            });

            console.log("SECURITY LOGIN RESPONSE:", response);

            /*
             * The API documentation says:
             *
             * 200 → Login successful
             * 202 → OTP required
             *
             * Since 2FA/OTP is disabled for now, we handle this as an error path
             * from the Axios response rather than from the typed login payload.
             */

            const data = response || {};

            if (!data?.access || !data?.refresh) {
                setError("Login failed. The server did not return valid login tokens.");
                return;
            }

            /*
             * Save the tokens if your security portal needs
             * authenticated API requests after login.
             */
            localStorage.setItem("security_access", data.access);
            localStorage.setItem("security_refresh", data.refresh);

            /*
             * Optional callback to parent.
             */
            onSignIn?.(email.trim(), password);

            /*
             * Redirect to your security dashboard.
             *
             * Change this route if your actual dashboard
             * has a different path.
             */
            router.push("/security/dashboard");
        } catch (err) {
            console.error("SECURITY LOGIN ERROR:", err);

            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const serverMessage =
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.response?.data?.error;

                if (status === 202) {
                    setError(
                        "Two-factor authentication is currently not supported."
                    );
                    return;
                }

                if (status === 400) {
                    setError(serverMessage || "Invalid email or password.");
                } else if (status === 401) {
                    setError(serverMessage || "Invalid email or password.");
                } else if (status === 403) {
                    setError(
                        serverMessage ||
                        "You are not authorized to access the security portal."
                    );
                } else if (!err.response) {
                    setError(
                        "Unable to connect to the server. Please check your network connection."
                    );
                } else {
                    setError(
                        serverMessage ||
                        "Something went wrong while signing in."
                    );
                }
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Top App Bar */}
            <Box className="flex items-center gap-3 px-4 py-1s bg-white border-b border-gray-100">
                <IconButton
                    onClick={() => {
                        if (onBack) {
                            onBack();
                        } else {
                            router.back();
                        }
                    }}
                    size="small"
                    className="bg-gray-100 hover:bg-gray-200"
                    aria-label="Go back"
                >
                    <ArrowBack fontSize="small" />
                </IconButton>

                <Box>
                    <Typography
                        variant="subtitle1"
                        className="font-semibold text-gray-900 leading-tight"
                    >
                        Gate access
                    </Typography>

                    <Typography
                        variant="caption"
                        className="text-gray-500"
                    >
                        Security sign in
                    </Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Box className="flex-1 flex flex-col items-center px-6 pt-4 pb-8">
                {/* Shield Icon */}
                {/* <Box className="relative mb-6">
                    <Box className="absolute inset-0 bg-indigo-100 rounded-full scale-150 opacity-60" />

                    <Box className="relative w-16 h-16 bg-[#1E3A5F] rounded-2xl flex items-center justify-center shadow-md">
                        <Shield className="text-white text-3xl" />
                    </Box>
                </Box> */}
                <div className="flex justify-center mb-5">
                    <div className="h-20 w-32 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                        <img
                            src="/sterlingLogo2.jpeg"
                            alt="Company logo"
                            className="h-20 w-20 object-contain"
                        />
                    </div>
                </div>

                <Typography
                    variant="overline"
                    className="tracking-widest text-gray-500 mb-1"
                >
                    SECURITY PORTAL
                </Typography>

                <Typography
                    variant="h5"
                    className="font-bold text-gray-900 mb-2 text-center"
                >
                    Gate sign in
                </Typography>

                <Typography
                    variant="body2"
                    className="text-gray-500 text-center max-w-xs mb-8 leading-relaxed"
                >
                    For estate security only. Sign in with the account
                    the estate issued you to check and admit visitors.
                </Typography>

                {/* Error */}
                {error && (
                    <Alert
                        severity="error"
                        className="w-full max-w-sm mb-5 !rounded-xl"
                    >
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm mt-5 space-y-5"
                >
                    <div className="flex items-center gap-2">
                        <TextField
                            fullWidth
                            placeholder="Work email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            autoComplete="email"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "9999px",
                                    backgroundColor: "white",

                                    "& fieldset": {
                                        borderColor: "#E2E8F0",
                                    },

                                    "&:hover fieldset": {
                                        borderColor: "#CBD5E1",
                                    },

                                    "&.Mui-focused fieldset": {
                                        borderColor: "#6366F1",
                                        borderWidth: "1.5px",
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <TextField
                            fullWidth
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="current-password"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined className="text-gray-400" />
                                        </InputAdornment>
                                    ),

                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                type="button"
                                                size="small"
                                                onClick={() =>
                                                    setShowPassword((prev) => !prev)
                                                }
                                                className="text-indigo-600 font-medium normal-case min-w-0 px-2"
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "9999px",
                                    backgroundColor: "white",

                                    "& fieldset": {
                                        borderColor: "#E2E8F0",
                                    },

                                    "&:hover fieldset": {
                                        borderColor: "#CBD5E1",
                                    },

                                    "&.Mui-focused fieldset": {
                                        borderColor: "#6366F1",
                                        borderWidth: "1.5px",
                                    },
                                },
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={
                            loading ||
                            !email.trim() ||
                            !password
                        }
                        endIcon={
                            !loading ? (
                                <span className="text-lg">→</span>
                            ) : undefined
                        }
                        className="!rounded-full !py-3 !text-base !font-semibold !normal-case !bg-[#6366F1] hover:!bg-[#4F46E5] !shadow-md"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>

                </Box>

                {/* Info Banner */}
                <Alert
                    icon={<InfoOutlined fontSize="small" />}
                    severity="info"
                    className="mt-8 w-full max-w-sm !rounded-xl !bg-gray-50 !text-gray-600 border border-gray-100"
                    sx={{
                        "& .MuiAlert-icon": {
                            color: "#64748B",
                        },
                    }}
                >
                    Residents do not sign in here. Go back and use your
                    meter or account number instead.
                </Alert>

                {/* Footer */}
                <Button
                    onClick={() => {
                        if (onBackToCustomer) {
                            onBackToCustomer();
                        } else {
                            router.push("/login");
                        }
                    }}
                    className="mt-6 !normal-case !text-gray-500 hover:!text-indigo-600 !font-medium"
                >
                    Back to customer sign in
                </Button>
            </Box>
        </Box>
    );
}
