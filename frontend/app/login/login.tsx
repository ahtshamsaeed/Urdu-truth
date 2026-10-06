"use client";

import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <main className="login-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06111f] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div aria-hidden="true" className="login-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="login-glow pointer-events-none absolute" />

      <section className="login-card relative z-10 w-full max-w-[420px]" aria-labelledby="login-heading">
        <div className="rounded-[22px] border border-white/[0.09] bg-[#0b1728]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:rounded-[24px] sm:p-8">
          <Link href="/" className="login-logo mx-auto mb-6 flex w-fit items-center gap-3" aria-label="UrduTruth home">
            <Image
              src="/urdu-truth-logo.png"
              alt=""
              width={52}
              height={52}
              priority
              className="h-[46px] w-[46px] object-contain"
            />
            <span className="text-[13px] font-bold tracking-[0.17em] text-slate-200">
              URDU <span className="text-cyan-300">TRUTH</span>
            </span>
          </Link>

          <div className="mb-6 text-center">
            <h1 id="login-heading" className="text-[26px] font-semibold tracking-[-0.035em]">
              Welcome back
            </h1>
            <p className="mt-1.5 text-[14px] text-slate-400">
              Sign in to your account
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="login-identifier" className="mb-2 block text-[13px] font-medium text-slate-300">
                Email or phone number
              </label>
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@example.com or +92 300 1234567"
                className="h-11 w-full rounded-xl border border-slate-700/80 bg-[#07111f] px-4 text-[14px] text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/80 focus:ring-4 focus:ring-cyan-400/[0.08]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-[13px] font-medium text-slate-300">
                  Password
                </label>
                <button type="button" className="text-[12px] font-medium text-cyan-300/90 transition hover:text-cyan-200">
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-xl border border-slate-700/80 bg-[#07111f] px-4 text-[14px] text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/80 focus:ring-4 focus:ring-cyan-400/[0.08]"
              />
            </div>

            <label htmlFor="remember" className="inline-flex cursor-pointer items-center gap-2.5 pt-0.5 text-[13px] text-slate-400">
              <input id="remember" name="remember" type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-[#07111f] accent-cyan-400 focus:ring-cyan-400" />
              Remember me
            </label>

            <button
              type="button"
              className="login-submit group relative mt-1 flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-cyan-400 px-4 text-[14px] font-semibold text-[#04111b] shadow-[0_8px_28px_rgba(34,211,238,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_12px_32px_rgba(34,211,238,0.24)] active:translate-y-0"
            >
              Sign in
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M3.5 10h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-800" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">Or continue with</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-700/80 bg-white/[0.02] text-[14px] font-medium text-slate-300 transition hover:border-slate-600 hover:bg-white/[0.05] hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.85 0-5.27-1.92-6.13-4.5H2.18v2.84A11 11 0 0 0 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.87 14.13A6.6 6.6 0 0 1 5.52 12c0-.74.13-1.45.35-2.13V7.03H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.97l3.69-2.84Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.03l3.69 2.84C6.73 7.3 9.15 5.38 12 5.38Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[13px] text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Create account
            </Link>
          </p>
        </div>
      </section>

      <style jsx>{`
        .login-grid {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse at 50% 45%, black 8%, transparent 78%);
        }

        .login-glow {
          top: 48%;
          left: 50%;
          width: min(75vw, 700px);
          aspect-ratio: 1;
          border-radius: 9999px;
          background: rgba(8, 145, 178, 0.075);
          filter: blur(130px);
          transform: translate(-50%, -50%);
        }

        .login-card {
          animation: login-enter 650ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .login-logo {
          animation: logo-enter 700ms 80ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .login-page {
          font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
        }

        .login-submit::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.24) 48%, transparent 74%);
          transform: translateX(-120%);
          transition: transform 600ms ease;
        }

        .login-submit:hover::before {
          transform: translateX(120%);
        }

        @keyframes login-enter {
          from {
            opacity: 0;
            transform: translateY(16px);
            filter: blur(3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes logo-enter {
          from {
            opacity: 0;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-card,
          .login-logo {
            animation: none;
          }

          .login-submit::before {
            display: none;
          }
        }

        @media (max-width: 380px) {
          .login-card > div {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}
