"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { UiIcon } from "./workspace-shell";

const claims = [
  {
    text: "حکومت نے نئی تعلیمی پالیسی کا اعلان کیا ہے",
    source: "Facebook · 12 min ago",
    status: "Likely fake",
    tone: "red",
    confidence: "87%",
    href: "/result/likely-fake",
  },
  {
    text: "ملک میں بارشوں کا نیا سلسلہ شروع ہونے کا امکان",
    source: "X · 1 hour ago",
    status: "Uncertain",
    tone: "amber",
    confidence: "52%",
    href: "/result/uncertain",
  },
  {
    text: "صحت کے محکمے نے ویکسینیشن مہم کی تصدیق کر دی",
    source: "News link · Yesterday",
    status: "Likely real",
    tone: "green",
    confidence: "91%",
    href: "/result/likely-real",
  },
];

const panelClass =
  "rounded-xl border border-white/[0.075] bg-[#0b1728]/85";

const toneClass: Record<string, string> = {
  green: "border-emerald-400/20 bg-emerald-400/[0.09] text-emerald-300",
  red: "border-rose-400/20 bg-rose-400/[0.09] text-rose-300",
  amber: "border-amber-400/20 bg-amber-400/[0.09] text-amber-300",
  cyan: "border-cyan-400/20 bg-cyan-400/[0.09] text-cyan-200",
};

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[22px] font-semibold tracking-[-0.035em] text-slate-100 sm:text-[26px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${panelClass} ${className}`}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.055] px-4 py-3.5 sm:px-5">
          <div>
            {title && (
              <h2 className="text-[13px] font-semibold text-slate-200">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-[11px] text-slate-500">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        secondary
          ? "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-3.5 text-xs font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200"
          : "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3.5 text-xs font-semibold text-[#06111f] transition hover:bg-cyan-300"
      }
    >
      {children}
    </Link>
  );
}

function StatusBadge({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold ${toneClass[tone] ?? toneClass.cyan}`}
    >
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  note,
  tone = "cyan",
}: {
  label: string;
  value: string;
  note: string;
  tone?: string;
}) {
  const color =
    tone === "red"
      ? "text-rose-300"
      : tone === "green"
        ? "text-emerald-300"
        : "text-slate-100";
  return (
    <div className={`${panelClass} p-4`}>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`mt-2 text-[25px] font-semibold leading-none tracking-tight ${color}`}>
        {value}
      </p>
      <p className="mt-2 text-[10px] text-slate-500">{note}</p>
    </div>
  );
}

function RecentChecks({ limit }: { limit?: number }) {
  const visibleClaims = limit ? claims.slice(0, limit) : claims;
  return (
    <div className="divide-y divide-white/[0.055]">
      {visibleClaims.map((claim) => (
        <Link
          href={claim.href}
          key={claim.text}
          className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        >
          <div className="min-w-0">
            <p className="truncate text-[13px] text-slate-200" lang="ur" dir="rtl">
              {claim.text}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">{claim.source}</p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <StatusBadge tone={claim.tone}>{claim.status}</StatusBadge>
            <span className="w-9 text-right text-[11px] font-medium text-slate-400">
              {claim.confidence}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function DashboardScreen() {
  const bars = [38, 58, 45, 78, 55, 88, 65];
  return (
    <>
      <PageHeader
        eyebrow="Your workspace"
        title="Welcome back, Ayesha"
        description="Here’s a quick look at your recent fact-checking activity."
        action={<ActionLink href="/check"><UiIcon name="check" />Check a post</ActionLink>}
      />

      <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard label="Checks completed" value="128" note="↑ 12% this month" />
        <MetricCard label="Likely fake" value="47" note="Claims needing attention" tone="red" />
        <MetricCard label="Likely real" value="68" note="Supported by evidence" tone="green" />
        <MetricCard label="Avg. confidence" value="92.4%" note="Across your checks" />
      </section>

      <section className="mb-5 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel
          title="Ready to verify something?"
          description="Paste a claim or upload an image to get started."
          className="relative overflow-hidden"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-cyan-400/[0.07] blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/[0.1] text-cyan-200">
                <UiIcon name="evidence" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13px] font-medium text-slate-200">Fact-check Urdu and English posts</p>
                <p className="mt-1 text-[11px] text-slate-500">Text and image analysis in one workspace</p>
              </div>
            </div>
            <ActionLink href="/check">Start a check <span aria-hidden="true">→</span></ActionLink>
          </div>
        </Panel>

        <Panel title="Weekly activity" description="Checks completed this week">
          <div className="flex h-[88px] items-end justify-between gap-2">
            {bars.map((height, index) => (
              <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-300/90 opacity-90 transition hover:opacity-100"
                  style={{ height: `${height}%` }}
                  title={`${Math.round(height / 10)} checks`}
                />
                <span className="text-[9px] text-slate-600">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel
        title="Recent checks"
        description="Your latest claim assessments"
        action={<Link href="/history" className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200">View history →</Link>}
      >
        <RecentChecks />
      </Panel>
    </>
  );
}

export function CheckPostScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function startAnalysis(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/analysis");
  }

  return (
    <>
      <PageHeader
        eyebrow="Fact check"
        title="Check a post"
        description="Add the claim you want to verify. You can include an image for extra context."
      />
      <form onSubmit={startAnalysis} className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Panel title="Post text" description="Paste the complete text of the claim">
          <label className="sr-only" htmlFor="claim-text">Post text</label>
          <textarea
            id="claim-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="یہاں اردو یا انگریزی پوسٹ کا متن درج کریں..."
            dir="auto"
            className="min-h-[210px] w-full resize-y rounded-lg border border-white/[0.08] bg-[#07111f] p-4 text-[14px] leading-7 text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
          />
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
            <span>Urdu and English supported</span>
            <span>{text.length} characters</span>
          </div>
        </Panel>

        <Panel title="Image (optional)" description="Add a screenshot or image from the post">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex min-h-[210px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-cyan-300/20 bg-[#07111f]/80 px-4 text-center transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.025]"
          >
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/[0.08] text-cyan-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
                <path d="M12 16V4m0 0L8 8m4-4 4 4M5 14v5h14v-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[13px] font-medium text-slate-200">
              {selectedFile ? selectedFile.name : "Drop image here or browse"}
            </span>
            <span className="mt-1.5 text-[11px] text-slate-500">PNG, JPG or WEBP · up to 10 MB</span>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInput.current) fileInput.current.value = "";
              }}
              className="mt-2 text-[11px] text-rose-300 hover:text-rose-200"
            >
              Remove image
            </button>
          )}
        </Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 xl:col-span-2">
          <p className="text-[11px] text-slate-500">Your submission stays in this browser preview.</p>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 text-xs font-semibold text-[#06111f] transition hover:bg-cyan-300"
          >
            Analyze with AI <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </>
  );
}

export function AnalysisScreen() {
  const steps = [
    ["Content received", "Text and image prepared for review", true],
    ["Checking claim context", "Comparing details against available references", true],
    ["Reviewing evidence", "Assessing sources and supporting information", false],
  ] as const;

  return (
    <>
      <PageHeader eyebrow="Fact check · In progress" title="Analyzing your post" description="We’re reviewing the claim and gathering context for an evidence-based assessment." />
      <div className="mx-auto max-w-3xl">
        <section className={`${panelClass} overflow-hidden`}>
          <div className="border-b border-white/[0.06] bg-gradient-to-r from-cyan-400/[0.07] to-transparent px-5 py-5 sm:px-7">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.07]">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300 motion-reduce:animate-none" />
                <span className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Reviewing claim</p>
                <p className="mt-1 text-xs text-slate-500">This demo uses illustrative sample results.</p>
              </div>
            </div>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-600 to-cyan-300" />
            </div>
          </div>
          <div className="divide-y divide-white/[0.055] px-5 sm:px-7">
            {steps.map(([title, description, done], index) => (
              <div className="flex items-start gap-3 py-4" key={title}>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${done ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-200"}`}>
                  {done ? "✓" : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-slate-200">{title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{description}</p>
                </div>
                <span className="ml-auto text-[10px] text-slate-600">{done ? "Done" : index === 2 ? "In progress" : "Next"}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-white/[0.06] p-4 sm:px-7">
            <ActionLink href="/check" secondary>Cancel</ActionLink>
            <ActionLink href="/result/likely-real">View sample result →</ActionLink>
          </div>
        </section>
      </div>
    </>
  );
}

type ResultKind = "likely-real" | "likely-fake" | "uncertain";

const results: Record<ResultKind, { label: string; score: number; tone: string; summary: string; color: string }> = {
  "likely-real": { label: "Likely real", score: 91, tone: "green", summary: "The main details in this claim are supported by the available references reviewed for this sample.", color: "#34d399" },
  "likely-fake": { label: "Likely fake", score: 87, tone: "red", summary: "The claim contains details that do not align with the available references reviewed for this sample.", color: "#fb7185" },
  uncertain: { label: "Uncertain", score: 52, tone: "amber", summary: "There is not enough reliable evidence in this sample to make a confident determination.", color: "#fbbf24" },
};

export function ResultScreen({ kind }: { kind: ResultKind }) {
  const result = results[kind];
  const score = result.score;
  return (
    <>
      <PageHeader eyebrow="Fact-check result" title="Result" description="A sample assessment with the confidence and supporting context shown together." action={<ActionLink href="/check"><UiIcon name="check" />Check another post</ActionLink>} />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <section className={`${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full" style={{ background: `conic-gradient(${result.color} ${score * 3.6}deg, rgba(148,163,184,.12) 0deg)` }}>
                  <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#0b1728] text-lg font-semibold" style={{ color: result.color }}>{score}%</div>
                </div>
                <div>
                  <StatusBadge tone={result.tone}>{result.label}</StatusBadge>
                  <p className="mt-1.5 text-[11px] text-slate-500">Confidence score</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-600">Sample result · Today</span>
            </div>
            <p className="mt-5 text-[13px] leading-6 text-slate-300">{result.summary}</p>
            <div className="mt-5 rounded-lg border border-white/[0.06] bg-[#07111f]/80 p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Claim reviewed</p>
              <p className="mt-2 text-[13px] leading-6 text-slate-300" lang="ur" dir="rtl">{claims[kind === "likely-real" ? 2 : kind === "likely-fake" ? 0 : 1].text}</p>
            </div>
          </section>

          <Panel title="Score breakdown" description="Signals considered in this assessment">
            <div className="space-y-4">
              {[
                ["Text context", kind === "uncertain" ? 58 : 92],
                ["Source reliability", kind === "likely-fake" ? 42 : kind === "uncertain" ? 49 : 88],
                ["Evidence match", kind === "likely-fake" ? 36 : kind === "uncertain" ? 55 : 94],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-[11px]"><span className="text-slate-400">{label}</span><span className="text-slate-300">{value}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: result.color }} /></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Why this result?" description="Key signals from the sample review">
            <ul className="space-y-3 text-[12px] leading-5 text-slate-400">
              <li className="flex gap-2.5"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />Claim details were compared with available contextual references.</li>
              <li className="flex gap-2.5"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />Source quality and corroboration affect the confidence score.</li>
              <li className="flex gap-2.5"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />Automated assessments are not a substitute for independent verification.</li>
            </ul>
          </Panel>
          <Panel title="Evidence & related sources" action={<Link href="/evidence" className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200">View all →</Link>}>
            <RecentChecks limit={1} />
          </Panel>
          <div className="flex flex-wrap gap-2">
            <Link href="/saved" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.1] px-3 text-xs text-slate-300 hover:border-cyan-300/30 hover:text-cyan-200"><UiIcon name="saved" />Save check</Link>
            <ActionLink href="/evidence">Explore evidence</ActionLink>
          </div>
        </div>
      </div>
    </>
  );
}

export function EvidenceScreen() {
  const sources = [
    ["Official health advisory", "Public health authority · Primary source", "Supports", "green"],
    ["Related fact-check report", "Independent fact-check organization", "Context", "cyan"],
    ["Original post details", "Social media · Unverified source", "Unverified", "amber"],
    ["Archived announcement", "Public information archive", "Related", "cyan"],
  ];
  return (
    <>
      <PageHeader eyebrow="Research" title="Evidence & sources" description="Review the references and context considered during the sample fact check." action={<ActionLink href="/check"><UiIcon name="check" />New check</ActionLink>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="grid gap-3 md:grid-cols-2">
          {sources.map(([title, description, tag, tone], index) => (
            <article key={title} className={`${panelClass} p-4 sm:p-5`}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/[0.08] text-cyan-200"><UiIcon name="evidence" className="h-[18px] w-[18px]" /></span>
                <StatusBadge tone={tone}>{tag}</StatusBadge>
              </div>
              <h2 className="text-[13px] font-semibold text-slate-200">{title}</h2>
              <p className="mt-1.5 text-[11px] text-slate-500">{description}</p>
              <p className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] leading-5 text-slate-400">
                {index === 0 ? "Published guidance provides useful context for assessing the central details in the post." : "This reference is included as context and should be reviewed alongside primary sources."}
              </p>
              <button type="button" className="mt-3 text-[11px] font-medium text-cyan-300 hover:text-cyan-200">View source ↗</button>
            </article>
          ))}
        </div>
        <Panel title="Related fact-check" description="Sample claim">
          <p className="text-[12px] leading-6 text-slate-300" lang="ur" dir="rtl">{claims[0].text}</p>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <StatusBadge tone="red">Likely fake</StatusBadge>
            <Link href="/result/likely-fake" className="text-[11px] text-cyan-300 hover:text-cyan-200">Open result →</Link>
          </div>
        </Panel>
      </div>
    </>
  );
}

export function HistoryScreen() {
  const [filter, setFilter] = useState("All checks");
  const filters = ["All checks", "Likely real", "Likely fake", "Uncertain"];
  const filtered = claims.filter((claim) => filter === "All checks" || claim.status === filter);
  return (
    <>
      <PageHeader eyebrow="Your activity" title="Check history" description="Find and revisit your recent fact-checks." action={<ActionLink href="/check"><UiIcon name="check" />Check a post</ActionLink>} />
      <Panel title="Recent checks" description="Sample activity from your workspace" action={<span className="text-[10px] text-slate-500">{filtered.length} checks</span>}>
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-[10px] transition ${filter === item ? "border-cyan-300/30 bg-cyan-300/[0.08] text-cyan-200" : "border-white/[0.08] text-slate-500 hover:text-slate-300"}`}>{item}</button>)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead><tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.12em] text-slate-600"><th className="pb-3 font-medium">Claim</th><th className="pb-3 font-medium">Source</th><th className="pb-3 font-medium">Result</th><th className="pb-3 text-right font-medium">Confidence</th></tr></thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((claim) => <tr key={claim.text} className="group">
                <td className="max-w-[320px] py-4 pr-4"><Link href={claim.href} className="block truncate text-[12px] text-slate-200 group-hover:text-cyan-200" lang="ur" dir="rtl">{claim.text}</Link><span className="mt-1 block text-[10px] text-slate-600">Today · Sample check</span></td>
                <td className="py-4 pr-4 text-[11px] text-slate-400">{claim.source.split(" · ")[0]}</td>
                <td className="py-4 pr-4"><StatusBadge tone={claim.tone}>{claim.status}</StatusBadge></td>
                <td className="py-4 text-right text-[11px] text-slate-300">{claim.confidence}</td>
              </tr>)}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-10 text-center text-xs text-slate-500">No checks match this filter.</p>}
        </div>
      </Panel>
    </>
  );
}

export function SavedChecksScreen() {
  return (
    <>
      <PageHeader eyebrow="Your library" title="Saved checks" description="A quick collection of claims you want to revisit." action={<ActionLink href="/check"><UiIcon name="check" />New check</ActionLink>} />
      <div className="grid gap-3 lg:grid-cols-2">
        {claims.map((claim, index) => (
          <article key={claim.text} className={`${panelClass} p-4 sm:p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <StatusBadge tone={claim.tone}>{claim.status}</StatusBadge>
              <span className="text-[10px] text-slate-600">Saved {index + 1} day{index ? "s" : ""} ago</span>
            </div>
            <p className="text-[13px] leading-6 text-slate-200" lang="ur" dir="rtl">{claim.text}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span className="text-[10px] text-slate-500">{claim.source}</span>
              <Link href={claim.href} className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200">View check →</Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Toggle({
  label,
  description,
  initial = true,
}: {
  label: string;
  description: string;
  initial?: boolean;
}) {
  const [enabled, setEnabled] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div><p className="text-[12px] font-medium text-slate-200">{label}</p><p className="mt-1 text-[11px] text-slate-500">{description}</p></div>
      <button type="button" role="switch" aria-checked={enabled} aria-label={label} onClick={() => setEnabled(!enabled)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-cyan-400" : "bg-slate-700"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <>
      <PageHeader eyebrow="Preferences" title="Settings" description="Choose how UrduTruth works for you." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Notifications" description="Decide which updates you receive">
          <div className="divide-y divide-white/[0.055]">
            <Toggle label="Check complete" description="Let me know when an analysis is ready." />
            <Toggle label="Product updates" description="Occasional news about workspace improvements." initial={false} />
            <Toggle label="Weekly summary" description="A weekly overview of your fact-check activity." />
          </div>
        </Panel>
        <Panel title="Workspace preferences" description="Personalize your default experience">
          <label className="mb-2 block text-[11px] font-medium text-slate-400" htmlFor="language">Preferred language</label>
          <select id="language" defaultValue="English" className="h-10 w-full rounded-lg border border-white/[0.09] bg-[#07111f] px-3 text-xs text-slate-200 outline-none focus:border-cyan-400/40">
            <option>English</option><option>Urdu</option>
          </select>
          <label className="mb-2 mt-5 block text-[11px] font-medium text-slate-400" htmlFor="retention">Saved check preference</label>
          <select id="retention" defaultValue="Keep saved checks" className="h-10 w-full rounded-lg border border-white/[0.09] bg-[#07111f] px-3 text-xs text-slate-200 outline-none focus:border-cyan-400/40">
            <option>Keep saved checks</option><option>Ask before saving</option>
          </select>
          <p className="mt-4 text-[10px] leading-5 text-slate-600">Preferences shown here are local preview controls.</p>
        </Panel>
      </div>
    </>
  );
}

export function ProfileScreen() {
  return (
    <>
      <PageHeader eyebrow="Your account" title="Profile" description="Manage the profile details associated with this workspace." action={<button type="button" className="h-9 rounded-lg border border-white/[0.1] px-3.5 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200">Edit profile</button>} />
      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <section className={`${panelClass} p-5 text-center`}>
          <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-teal-600 text-2xl font-semibold text-[#06111f] ring-4 ring-cyan-300/[0.08]">A</div>
          <h2 className="mt-4 text-[15px] font-semibold text-slate-100">Ayesha Khan</h2>
          <p className="mt-1 text-[11px] text-slate-500">UrduTruth member</p>
          <StatusBadge tone="green">Account active</StatusBadge>
          <p className="mt-4 text-[10px] text-slate-600">Member since January 2026</p>
        </section>
        <Panel title="Personal information" description="Sample profile information">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[["Full name", "Ayesha Khan"], ["Email address", "ayesha@example.com"], ["Phone number", "+92 300 1234567"], ["Preferred language", "English · Urdu"]].map(([label, value]) => (
              <div className="rounded-lg border border-white/[0.055] bg-[#07111f]/70 p-3.5" key={label}><dt className="text-[10px] text-slate-500">{label}</dt><dd className="mt-1.5 text-[12px] text-slate-200">{value}</dd></div>
            ))}
          </dl>
        </Panel>
      </div>
    </>
  );
}

export function HowItWorksScreen() {
  const steps = [
    ["01", "Add a claim", "Paste Urdu or English post text and optionally include an image."],
    ["02", "Review the context", "The analysis flow compares details and looks for relevant evidence."],
    ["03", "Understand the result", "See a confidence estimate, key signals, and references together."],
  ];
  return (
    <>
      <PageHeader eyebrow="Getting started" title="How UrduTruth works" description="A clear, evidence-first workflow for checking social media claims." action={<ActionLink href="/check"><UiIcon name="check" />Try a check</ActionLink>} />
      <div className="grid gap-3 lg:grid-cols-3">
        {steps.map(([number, title, description]) => (
          <article key={number} className={`${panelClass} p-5 sm:p-6`}>
            <span className="text-[12px] font-semibold tracking-[0.14em] text-cyan-300">{number}</span>
            <h2 className="mt-5 text-[15px] font-semibold text-slate-100">{title}</h2>
            <p className="mt-2 text-[12px] leading-6 text-slate-400">{description}</p>
          </article>
        ))}
      </div>
      <div className={`${panelClass} mt-4 flex flex-wrap items-center justify-between gap-4 p-5`}>
        <div><h2 className="text-[13px] font-semibold text-slate-200">Use results thoughtfully</h2><p className="mt-1 text-[11px] text-slate-500">Automated assessments can be uncertain. Check the cited sources and original context.</p></div>
        <ActionLink href="/evidence">Explore evidence</ActionLink>
      </div>
    </>
  );
}
