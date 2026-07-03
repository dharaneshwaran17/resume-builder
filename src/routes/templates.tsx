import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useResumes } from "../context/ResumeContext";
import { TEMPLATES, ResumeRenderer } from "../components/templates";
import { seedResume } from "../lib/resume-factory";
import { toast } from "../components/Toaster";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates — Cursive" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const { user, ready } = useAuth();
  const { create, update } = useResumes();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", search: { mode: "login" as const } });
  }, [ready, user, navigate]);

  const preview = seedResume();

  const startFrom = (templateId: (typeof TEMPLATES)[number]["id"]) => {
    const r = create(`New ${templateId} resume`);
    update(r.id, { template: templateId });
    toast("Created", "success");
    navigate({ to: "/editor/$id", params: { id: r.id } });
  };

  return (
    <main className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-ink/40 mb-3">Templates</p>
          <h1 className="font-serif text-5xl leading-tight text-balance">
            Three quiet templates, all ATS-friendly.
          </h1>
          <p className="mt-3 text-ink/50">
            Every template renders the same data — pick the one whose voice matches yours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-3"
            >
              <div className="aspect-[1/1.414] bg-white rounded-xl outline-1 -outline-offset-1 outline-black/5 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div
                  className="origin-top-left"
                  style={{ transform: "scale(0.42)", width: "238%", height: "238%" }}
                >
                  <ResumeRenderer resume={{ ...preview, template: t.id }} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-serif text-xl">{t.name}</h3>
                  <p className="text-xs text-ink/50">{t.blurb}</p>
                </div>
                <button
                  onClick={() => startFrom(t.id)}
                  className="rounded-full bg-ink text-paper text-xs font-medium px-3 py-1.5"
                >
                  Use
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-8">
          <Link to="/" className="text-sm underline text-ink/50">← Back to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
