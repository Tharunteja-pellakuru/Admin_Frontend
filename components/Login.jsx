import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import {
  Briefcase,
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const API_BASE = "https://adminbackend-production-d381.up.railway.app";

const Login = () => {
  const navigate = useNavigate();
  const { login, users } = useStore();

  // Login State
  const [email, setEmail] = useState("superadmin@careers.com");
  const [password, setPassword] = useState("Password@1234");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("idle");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      // ⭐ FIX: Save token so authenticateUser works
      localStorage.setItem("token", data.token);

      // ⭐ FIX: Save logged-in user in context
      login(data.user);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setResetStatus("success");
    }, 1500);
  };

  const resetView = () => {
    setIsForgotPassword(false);
    setResetStatus("idle");
    setError("");
    setResetEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
          <Briefcase className="text-white" size={24} />
        </div>
        <span className="text-3xl font-bold text-gray-800">
          Careers<span className="text-primary">Admin</span>
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8">
        {!isForgotPassword ? (
          /* LOGIN FORM */
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Sign in to manage your jobs and applications
            </p>

            {/* Demo Credentials Hint */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex flex-col items-center">
              <span className="font-semibold mb-1">Demo Credentials</span>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <span>
                  Email:{" "}
                  <span className="font-mono font-bold">admin@careers.com</span>
                </span>
                <span>
                  Pass: <span className="font-mono font-bold">password123</span>
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="admin@careers.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-primary cursor-pointer accent-primary"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/30 disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </>
        ) : (
          /* FORGOT PASSWORD FORM */
          <>
            {resetStatus === "success" ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Check your email
                </h2>
                <p className="text-gray-500 mb-8">
                  We have sent password recovery instructions to{" "}
                  <span className="font-medium text-gray-800">
                    {resetEmail}
                  </span>
                  .
                </p>
                <button
                  onClick={resetView}
                  className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={resetView}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors text-sm font-medium"
                >
                  <ArrowLeft size={16} /> Back to Login
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Reset Password
                </h2>
                <p className="text-gray-500 text-center mb-8">
                  Enter your email address and we'll send you instructions to
                  reset your password.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="admin@careers.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/30 disabled:opacity-70 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Careers Admin Panel. All rights
        reserved.
      </p>
    </div>
  );
};

export default Login;
