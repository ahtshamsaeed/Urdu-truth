"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-700/80 bg-[#07111f] px-3.5 text-[14px] text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-400/80 focus:ring-4 focus:ring-cyan-400/[0.08]";

const labelClass = "mb-2 block text-[13px] font-medium text-slate-300";

export default function Signup() {
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");

  function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="signup-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06111f] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div aria-hidden="true" className="signup-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="signup-glow pointer-events-none absolute" />

      <section
        className="signup-card relative z-10 w-full max-w-[540px]"
        aria-labelledby="signup-heading"
      >
        <div className="rounded-[22px] border border-white/[0.09] bg-[#0b1728]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:rounded-[24px] sm:p-8">
          <Link
            href="/"
            className="signup-logo mx-auto mb-5 flex w-fit items-center gap-3 sm:mb-6"
            aria-label="UrduTruth home"
          >
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

          <header className="mb-5 text-center sm:mb-6">
            <h1
              id="signup-heading"
              className="text-[26px] font-semibold tracking-[-0.035em]"
            >
              Create your account
            </h1>
            <p className="mt-1.5 text-[14px] text-slate-400">
              Sign up to start checking what matters.
            </p>
          </header>

          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={handleSignup}
          >
            <div className="sm:col-span-2">
              <label htmlFor="full-name" className={labelClass}>
                Full name
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              {contactMethod === "email" ? (
                <>
                  <label htmlFor="signup-email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                  <p className="mt-2 text-[12px] text-slate-500">
                    Want to use your phone instead?{" "}
                    <button
                      type="button"
                      onClick={() => setContactMethod("phone")}
                      className="font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Sign up with phone
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <label htmlFor="signup-phone" className={labelClass}>
                    Phone number
                  </label>
                  <input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    placeholder="+92 300 1234567"
                    className={inputClass}
                  />
                  <p className="mt-2 text-[12px] text-slate-500">
                    Prefer email?{" "}
                    <button
                      type="button"
                      onClick={() => setContactMethod("email")}
                      className="font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Sign up with email
                    </button>
                  </p>
                </>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="signup-password" className={labelClass}>
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="Create a password"
                className={inputClass}
              />
              <p className="mt-1.5 text-[11px] text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="confirm-password" className={labelClass}>
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="Enter your password again"
                className={inputClass}
              />
            </div>

            <label
              htmlFor="terms"
              className="flex cursor-pointer items-start gap-2.5 pt-0.5 text-[12px] leading-5 text-slate-400 sm:col-span-2"
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-[#07111f] accent-cyan-400 focus:ring-cyan-400"
              />
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  className="text-slate-300 underline decoration-slate-700 underline-offset-2 transition hover:text-white"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-slate-300 underline decoration-slate-700 underline-offset-2 transition hover:text-white"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              className="signup-submit group relative mt-1 flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-cyan-400 px-4 text-[14px] font-semibold text-[#04111b] shadow-[0_8px_28px_rgba(34,211,238,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_12px_32px_rgba(34,211,238,0.24)] active:translate-y-0 sm:col-span-2"
            >
              Create account
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path
                  d="M3.5 10h13m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-800" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
              Or sign up with
            </span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-700/80 bg-white/[0.02] text-[14px] font-medium text-slate-300 transition hover:border-slate-600 hover:bg-white/[0.05] hover:text-white"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
              <path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8V33c3.4 6.6 10.2 11 18.2 11Z" />
              <path fill="#4CAF50" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.4H5.8a20 20 0 0 0 0 18l6.8-5.4Z" />
              <path fill="#1976D2" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.8 29.5 4 24 4 16 4 9.2 8.4 5.8 15l6.8 5.4C14.2 15.6 18.7 12 24 12Z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[13px] text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <style jsx>{`
        .signup-page {
          font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
          isolation: isolate;
        }

        .signup-grid {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse at 50% 45%, black 8%, transparent 78%);
        }

        .signup-glow {
          top: 48%;
          left: 50%;
          width: min(75vw, 700px);
          aspect-ratio: 1;
          border-radius: 9999px;
          background: rgba(8, 145, 178, 0.075);
          filter: blur(130px);
          transform: translate(-50%, -50%);
        }

        .signup-card {
          animation: signup-enter 650ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .signup-logo {
          animation: signup-enter 700ms 80ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .signup-submit::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 20%,
            rgba(255, 255, 255, 0.24) 48%,
            transparent 74%
          );
          transform: translateX(-120%);
          transition: transform 600ms ease;
        }

        .signup-submit:hover::before {
          transform: translateX(120%);
        }

        @keyframes signup-enter {
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

        @media (prefers-reduced-motion: reduce) {
          .signup-card,
          .signup-logo {
            animation: none;
          }

          .signup-submit::before {
            display: none;
          }
        }

        @media (max-width: 380px) {
          .signup-card > div {
            padding: 18px;
          }
        }

        @media (min-width: 640px) {
          .signup-card form {
            row-gap: 16px;
          }
        }
      `}</style>
    </main>
  );
}
