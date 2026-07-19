"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn, Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const errorParam = searchParams.get("error");

  const [loginLoading, setLoginLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam === "access_denied") {
      setErrorMsg("Access denied. Only authorized accounts can access the admin panel.");
    }
  }, [errorParam]);

  const handleLogin = async (provider: "google" | "github") => {
    setLoginLoading(provider);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();

      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        setErrorMsg(data.error?.message || "Login failed. Please try again.");
      }
    } catch {
      setErrorMsg("Login failed. Please try again.");
    } finally {
      setLoginLoading(null);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8 relative z-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to site
      </Link>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
          <LogIn className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Admin Access
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in with your authorized account
          </p>
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
          <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-300/90 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Login buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleLogin("google")}
          disabled={loginLoading !== null}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginLoading === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <button
          onClick={() => handleLogin("github")}
          disabled={loginLoading !== null}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginLoading === "github" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          )}
          Continue with GitHub
        </button>
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-center text-zinc-600 leading-relaxed">
        Only authorized accounts can access the admin panel.
        <br />
        Unauthorized login attempts will be logged.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, rgb(239 68 68) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background:
              "radial-gradient(circle, rgb(168 85 247) 0%, transparent 70%)",
          }}
        />
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500">Loading form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
