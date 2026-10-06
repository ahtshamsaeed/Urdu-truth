"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const features = [
  "Urdu text + image analysis",
  "Evidence-based results",
  "Trusted fact-check sources",
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2700);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="splash">
      <div aria-hidden="true" className="splash-grid" />
      <div aria-hidden="true" className="splash-glow splash-glow-top" />
      <div aria-hidden="true" className="splash-glow splash-glow-bottom" />

      <section className="splash-content" aria-label="UrduTruth introduction">
        <header className="brand">
          <Image
            src="/urdu-truth-logo.png"
            alt=""
            width={800}
            height={350}
            priority
            className="brand-mark"
          />
          <span className="brand-name">
            URDU <strong>TRUTH</strong>
          </span>
        </header>

        <div className="splash-hero">
          <div className="hero-copy">
            <h1>
              Detect misinformation.
              <span>Verify what matters.</span>
            </h1>

            <p className="hero-description">
              AI-powered multimodal fact checking for Urdu social media content.
            </p>

            <p className="urdu-message" lang="ur" dir="rtl">
              غلط خبروں کی نشاندہی کریں، سچ کی تصدیق کریں
            </p>

            <ul className="feature-list" aria-label="UrduTruth features">
              {features.map((feature) => (
                <li key={feature}>
                  <span className="check-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="m4.25 8.2 2.35 2.3 5.15-5.1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="loading" role="status" aria-live="polite">
            <div className="loading-track">
              <div className="loading-bar" />
            </div>
            <span className="loading-label">
              <span className="status-dot" />
              Preparing your workspace
            </span>
          </div>
        </div>

        <footer className="splash-footer">UrduTruth.com</footer>
      </section>

      <style>{`
        .splash {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 100vh;
          min-height: 100svh;
          overflow: hidden;
          padding: clamp(32px, 6.2vh, 62px) clamp(28px, 8vw, 112px)
            clamp(28px, 5vh, 52px);
          background:
            radial-gradient(ellipse at 88% 12%, rgba(13, 148, 170, 0.12), transparent 24rem),
            radial-gradient(ellipse at 15% 82%, rgba(8, 145, 178, 0.13), transparent 24rem),
            #070e1b;
          color: #e8eef8;
          font-family: Arial, Helvetica, sans-serif;
        }

        .splash-grid {
          position: absolute;
          z-index: -1;
          inset: 0;
          background-image: radial-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px);
          background-position: 4px 4px;
          background-size: 24px 24px;
          mask-image: linear-gradient(90deg, black, transparent 84%);
          opacity: 0.35;
          animation: grid-arrive 900ms ease-out both;
        }

        .splash-glow {
          position: absolute;
          z-index: -1;
          width: min(42vw, 520px);
          aspect-ratio: 1;
          border-radius: 50%;
          background: rgba(34, 211, 238, 0.07);
          filter: blur(110px);
          pointer-events: none;
        }

        .splash-glow-top {
          top: -28%;
          right: 2%;
        }

        .splash-glow-bottom {
          bottom: -38%;
          left: -14%;
          background: rgba(8, 145, 178, 0.1);
        }

        .splash-content {
          display: flex;
          width: min(100%, 1120px);
          min-height: calc(100svh - clamp(60px, 11.2vh, 114px));
          margin: 0 auto;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 10px;
          animation: fade-up 550ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .brand-mark {
          display: block;
          width: 38px;
          height: 38px;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.12));
        }

        .brand-name {
          color: #dce5f2;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.16em;
          white-space: nowrap;
        }

        .brand-name strong {
          color: #22d3ee;
          font-weight: 700;
        }

        .splash-hero {
          width: 100%;
          max-width: 760px;
          margin: auto 0;
          padding: clamp(42px, 7vh, 76px) 0;
        }

        .hero-copy {
          animation: fade-up 700ms 100ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .splash h1 {
          margin: 0;
          font-size: clamp(2.25rem, 5.5vw, 4rem);
          font-weight: 750;
          line-height: 1.12;
          letter-spacing: -0.045em;
        }

        .splash h1 span {
          display: block;
          color: #22c9df;
        }

        .hero-description {
          max-width: 560px;
          margin: 22px 0 0;
          color: #a0afc3;
          font-size: clamp(0.95rem, 1.7vw, 1.08rem);
          line-height: 1.75;
        }

        .urdu-message {
          width: fit-content;
          max-width: 100%;
          margin: 27px 0 0;
          border-right: 2px solid #22d3ee;
          padding: 1px 14px 3px 0;
          color: #dce5f2;
          font-family: "Noto Nastaliq Urdu", "Noto Naskh Arabic", "Segoe UI", serif;
          font-size: clamp(1.18rem, 3.2vw, 1.7rem);
          line-height: 2.05;
          animation: fade-up 650ms 350ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .feature-list {
          display: grid;
          gap: 12px;
          margin: 22px 0 0;
          padding: 0;
          color: #aab7c9;
          font-size: 0.94rem;
          list-style: none;
          animation: fade-up 650ms 480ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 24px;
        }

        .check-icon {
          display: inline-flex;
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(34, 211, 238, 0.52);
          border-radius: 50%;
          color: #22d3ee;
          background: rgba(34, 211, 238, 0.07);
        }

        .check-icon svg {
          width: 14px;
          height: 14px;
        }

        .loading {
          width: min(320px, 100%);
          margin-top: 28px;
          animation: fade-up 550ms 650ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        .loading-track {
          width: 100%;
          height: 3px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(226, 232, 240, 0.1);
        }

        .loading-bar {
          width: 100%;
          height: 100%;
          transform: scaleX(0);
          transform-origin: left;
          border-radius: inherit;
          background: linear-gradient(90deg, #0891b2, #22d3ee 68%, #a5f3fc);
          box-shadow: 0 0 14px rgba(34, 211, 238, 0.45);
          animation: progress 2.25s cubic-bezier(0.3, 0, 0.2, 1) 100ms forwards;
        }

        .loading-label {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 11px;
          color: #6f8198;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          flex: 0 0 6px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 9px rgba(34, 211, 238, 0.7);
          animation: status-pulse 1.4s ease-in-out infinite;
        }

        .splash-footer {
          color: #718198;
          font-size: 0.75rem;
          animation: fade-up 500ms 550ms ease-out both;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(13px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes grid-arrive {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.35;
          }
        }

        @keyframes progress {
          to {
            transform: scaleX(1);
          }
        }

        @keyframes status-pulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @media (max-width: 640px) {
          .splash {
            min-height: 100svh;
            padding: 34px 30px 28px;
          }

          .splash-content {
            min-height: calc(100svh - 62px);
          }

          .brand {
            gap: 8px;
          }

          .brand-mark {
            width: 34px;
            height: 34px;
          }

          .brand-name {
            font-size: 12px;
            letter-spacing: 0.14em;
          }

          .splash-hero {
            padding: 60px 0;
          }

          .splash h1 {
            font-size: clamp(2.15rem, 8vw, 3.4rem);
            line-height: 1.14;
          }

          .hero-description {
            max-width: 440px;
            margin-top: 17px;
            font-size: 0.94rem;
            line-height: 1.7;
          }

          .urdu-message {
            margin-top: 22px;
            padding-right: 11px;
            font-size: clamp(1.05rem, 5vw, 1.45rem);
            line-height: 1.95;
          }

          .feature-list {
            gap: 11px;
            margin-top: 18px;
            font-size: 0.88rem;
          }

          .loading {
            width: min(290px, 100%);
            margin-top: 23px;
          }
        }

        @media (max-width: 380px) {
          .splash {
            padding: 28px 23px 24px;
          }

          .splash-content {
            min-height: calc(100svh - 52px);
          }

          .splash-hero {
            padding: 42px 0;
          }

          .splash h1 {
            font-size: clamp(1.9rem, 8.3vw, 2.2rem);
          }

          .hero-description {
            font-size: 0.88rem;
          }

          .urdu-message {
            font-size: 1.02rem;
          }

          .feature-list {
            font-size: 0.82rem;
          }
        }

        @media (max-height: 700px) and (min-width: 641px) {
          .splash {
            padding-top: 26px;
            padding-bottom: 24px;
          }

          .splash-hero {
            padding-top: 30px;
            padding-bottom: 30px;
          }

          .hero-description {
            margin-top: 16px;
          }

          .urdu-message {
            margin-top: 18px;
          }

          .feature-list {
            gap: 8px;
            margin-top: 15px;
          }

          .loading {
            margin-top: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
