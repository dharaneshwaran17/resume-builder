import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiPlus, FiEdit3, FiCopy, FiDownload, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useResumes } from "../context/ResumeContext";
import { completionPercent } from "../lib/scoring";
import { ResumeRenderer } from "../components/templates";
import { toast } from "../components/Toaster";
import { Landing } from "../components/Landing";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  return <Dashboard />;
}

function Dashboard() {
  const { user } = useAuth();
  const { resumes, create, remove, duplicate } = useResumes();
  const navigate = useNavigate();

  const totalDownloads = resumes.reduce((s, r) => s + r.downloads, 0);
  const avgCompletion = resumes.length
    ? Math.round(resumes.reduce((s, r) => s + completionPercent(r), 0) / resumes.length)
    : 0;

  const handleCreate = () => {
    const r = create(`Untitled — ${new Date().toLocaleDateString()}`);
    navigate({ to: "/editor/$id", params: { id: r.id } });
  };

  return (
    <main className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="font-serif text-4xl leading-none text-balance">
              Welcome back, {user!.name.split(" ")[0]}
            </h1>
            <p className="text-ink/50 text-base max-w-[56ch]">
              {resumes.length === 0
                ? "Let's start your career narrative."
                : `Your career narrative is currently ${avgCompletion}% complete.`}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper text-sm font-medium pl-3 pr-4 py-2.5 hover:-translate-y-px transition-transform ring-1 ring-ink"
          >
            <FiPlus /> Create resume
          </button>
        </motion.header>

        {/* Stat tiles */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatTile label="Active Resumes" value={String(resumes.length).padStart(2, "0")} />
          <StatTile label="PDF Downloads" value={String(totalDownloads)} />
          <StatTile label="Avg Completion" value={`${avgCompletion}%`} />
        </motion.div>

        {/* Resume grid */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Your resumes</h2>
            <Link to="/templates" className="text-sm text-ink/50 hover:text-ink underline underline-offset-4">
              Browse templates
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="rounded-3xl ring-1 ring-black/5 p-16 text-center">
              <p className="font-serif text-2xl mb-2">Blank slate.</p>
              <p className="text-ink/50 mb-6">Start with a template or a blank resume.</p>
              <button
                onClick={handleCreate}
                className="rounded-full bg-ink text-paper text-sm font-medium px-5 py-2.5"
              >
                Create your first resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumes.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="group space-y-3"
                >
                  <Link
                    to="/editor/$id"
                    params={{ id: r.id }}
                    className="block aspect-[1/1.414] bg-white rounded-xl outline-1 -outline-offset-1 outline-black/5 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div
                      className="w-full h-full origin-top-left"
                      style={{ transform: "scale(0.42)", width: "238%", height: "238%" }}
                    >
                      <ResumeRenderer resume={r} />
                    </div>
                  </Link>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">{r.name}</h3>
                      <p className="text-[10px] text-ink/40 uppercase tracking-tight">
                        Edited {formatDistanceToNow(new Date(r.updatedAt))} ago · {r.template}
                      </p>
                    </div>
                    <div className="flex gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <IconBtn label="Edit" onClick={() => navigate({ to: "/editor/$id", params: { id: r.id } })}>
                        <FiEdit3 size={13} />
                      </IconBtn>
                      <IconBtn
                        label="Duplicate"
                        onClick={() => {
                          duplicate(r.id);
                          toast("Duplicated", "success");
                        }}
                      >
                        <FiCopy size={13} />
                      </IconBtn>
                      <IconBtn label="Open" onClick={() => navigate({ to: "/editor/$id", params: { id: r.id } })}>
                        <FiDownload size={13} />
                      </IconBtn>
                      <IconBtn
                        label="Delete"
                        onClick={() => {
                          if (confirm(`Delete "${r.name}"?`)) {
                            remove(r.id);
                            toast("Deleted");
                          }
                        }}
                      >
                        <FiTrash2 size={13} />
                      </IconBtn>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 bg-paper ring-1 ring-black/5 rounded-2xl flex flex-col justify-between h-32">
      <span className="text-xs font-medium uppercase tracking-wider text-ink/40">{label}</span>
      <span className="text-4xl font-serif">{value}</span>
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="size-7 grid place-items-center rounded-md hover:bg-ink/5 text-ink/60"
    >
      {children}
    </button>
  );
}
