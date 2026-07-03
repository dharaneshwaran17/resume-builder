import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiDownload, FiPrinter } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useResumes } from "../context/ResumeContext";
import { ResumeRenderer, TEMPLATES } from "../components/templates";
import { EditorForm } from "../components/editor/EditorForm";
import { exportPdf } from "../lib/pdf";
import { toast } from "../components/Toaster";
import { atsScore, completionPercent } from "../lib/scoring";

export const Route = createFileRoute("/editor/$id")({
  head: () => ({ meta: [{ title: "Editor — Cursive" }] }),
  component: EditorPage,
});

const ACCENTS = ["#1c1917", "#78716c", "#0f766e", "#7c2d12", "#312e81", "#831843"];

function EditorPage() {
  const { id } = Route.useParams();
  const { user, ready } = useAuth();
  const { get, update, incrementDownloads } = useResumes();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", search: { mode: "login" as const } });
  }, [ready, user, navigate]);

  const resume = get(id);

  useEffect(() => {
    if (!resume) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 400);
    return () => clearTimeout(t);
  }, [resume]);

  if (!ready || !user) return <div className="min-h-screen bg-paper" />;
  if (!resume) {
    return (
      <div className="min-h-screen grid place-items-center bg-paper">
        <div className="text-center space-y-3">
          <p className="font-serif text-3xl">Resume not found.</p>
          <Link to="/" className="text-sm underline">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!previewRef.current) return;
    toast("Preparing PDF…");
    await exportPdf(previewRef.current, resume.name || "resume");
    incrementDownloads(resume.id);
    toast("Downloaded", "success");
  };

  const completion = completionPercent(resume);
  const ats = atsScore(resume);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Editor top bar */}
      <div className="sticky top-0 z-40 border-b border-black/5 bg-paper/85 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="size-8 grid place-items-center rounded-md hover:bg-ink/5 text-ink/60"
              aria-label="Back"
            >
              <FiArrowLeft />
            </Link>
            <input
              value={resume.name}
              onChange={(e) => update(resume.id, { name: e.target.value })}
              className="font-serif text-lg bg-transparent outline-none min-w-0 flex-1 focus:border-b focus:border-ink/20"
            />
            <span className="text-[10px] uppercase tracking-widest text-ink/40 hidden sm:inline">
              {saved ? "Saved" : "Saving…"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MetricBadge label="Completion" value={`${completion}%`} />
            <MetricBadge label="ATS" value={`${ats}`} />
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full ring-1 ring-black/10 text-xs font-medium px-3 py-1.5"
            >
              <FiPrinter size={12} /> Print
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper text-xs font-medium px-4 py-2"
            >
              <FiDownload size={12} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 py-8">
        {/* Left: form */}
        <div className="lg:col-span-5">
          <EditorForm
            resume={resume}
            onChange={(patch) => update(resume.id, patch)}
          />
        </div>

        {/* Right: preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-1 bg-ink/5 rounded">A4 Portrait</span>
                <div className="flex items-center gap-1.5">
                  {ACCENTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => update(resume.id, { accent: c })}
                      className="size-4 rounded-full transition-transform hover:scale-125"
                      style={{
                        background: c,
                        outline: resume.accent === c ? "2px solid var(--ink)" : "none",
                        outlineOffset: 2,
                      }}
                      aria-label={`Accent ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => update(resume.id, { template: t.id })}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      resume.template === t.id
                        ? "bg-ink text-paper"
                        : "text-ink/60 hover:bg-ink/5"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={resume.template}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-[1/1.414] w-full bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden print-area"
              ref={previewRef}
            >
              <ResumeRenderer resume={resume} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="hidden md:flex flex-col items-end leading-tight">
      <span className="text-[9px] uppercase tracking-widest text-ink/40">{label}</span>
      <span className="text-sm font-serif">{value}</span>
    </div>
  );
}
