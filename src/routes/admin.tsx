import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useResumes } from "../context/ResumeContext";
import { TEMPLATES } from "../components/templates";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Cursive" }] }),
  component: AdminPage,
});

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

function AdminPage() {
  const { user, ready } = useAuth();
  const { resumes } = useResumes();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login" as const } });
    } else if (user.role !== "admin") {
      navigate({ to: "/" });
    }
  }, [ready, user, navigate]);

  const users = useMemo<UserRow[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = JSON.parse(localStorage.getItem("cursive-users") || "[]");
      return raw.map((u: UserRow) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      }));
    } catch {
      return [];
    }
  }, []);

  const totalDownloads = resumes.reduce((s, r) => s + r.downloads, 0);
  const templateBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    TEMPLATES.forEach((t) => map.set(t.id, 0));
    resumes.forEach((r) => map.set(r.template, (map.get(r.template) || 0) + 1));
    return Array.from(map.entries());
  }, [resumes]);
  const topTemplate = templateBreakdown.reduce((a, b) => (b[1] > a[1] ? b : a), ["classic", 0])[0];

  // Monthly registrations (last 6 months)
  const monthlyReg = useMemo(() => {
    const buckets = new Map<string, number>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("en", { month: "short" });
      buckets.set(key, 0);
    }
    users.forEach((u) => {
      const d = new Date(u.createdAt);
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diffMonths >= 0 && diffMonths < 6) {
        const key = d.toLocaleString("en", { month: "short" });
        buckets.set(key, (buckets.get(key) || 0) + 1);
      }
    });
    return Array.from(buckets.entries());
  }, [users]);

  const maxReg = Math.max(1, ...monthlyReg.map(([, v]) => v));

  if (!ready || !user || user.role !== "admin") {
    return <div className="min-h-screen bg-paper" />;
  }

  return (
    <main className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/40 mb-2">Admin</p>
            <h1 className="font-serif text-4xl">Platform pulse</h1>
          </div>
          <span className="text-xs text-ink/40 uppercase tracking-widest">Last 30 days</span>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Tile label="Users" value={String(users.length)} />
          <Tile label="Resumes" value={String(resumes.length)} />
          <Tile label="Downloads" value={String(totalDownloads)} />
          <Tile label="Top template" value={topTemplate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Chart */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 p-8 bg-paper ring-1 ring-black/5 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl">Monthly registrations</h2>
              <span className="text-xs text-ink/40">Last 6 months</span>
            </div>
            <div className="flex items-end gap-3 h-48">
              {monthlyReg.map(([month, count]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxReg) * 100}%` }}
                    transition={{ type: "spring", damping: 22 }}
                    className="w-full bg-ink rounded-t-md min-h-[2px]"
                  />
                  <span className="text-[10px] text-ink/50 uppercase tracking-widest">{month}</span>
                  <span className="text-xs font-serif">{count}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Template breakdown */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 p-8 bg-paper ring-1 ring-black/5 rounded-3xl"
          >
            <h2 className="font-serif text-2xl mb-6">Template usage</h2>
            <div className="space-y-4">
              {templateBreakdown.map(([tid, count]) => {
                const pct = resumes.length ? (count / resumes.length) * 100 : 0;
                return (
                  <div key={tid}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{tid}</span>
                      <span className="text-ink/50">{count}</span>
                    </div>
                    <div className="h-1.5 bg-ink/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-ink rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* Users table */}
        <section className="p-8 bg-paper ring-1 ring-black/5 rounded-3xl">
          <h2 className="font-serif text-2xl mb-6">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-ink/40 border-b border-black/5">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-black/5 last:border-0">
                    <td className="py-3">{u.name}</td>
                    <td className="py-3 text-ink/60">{u.email}</td>
                    <td className="py-3">
                      <span className={`text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded ${u.role === "admin" ? "bg-ink text-paper" : "bg-ink/5 text-ink/60"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-ink/50 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 bg-paper ring-1 ring-black/5 rounded-2xl flex flex-col justify-between h-32">
      <span className="text-xs font-medium uppercase tracking-wider text-ink/40">{label}</span>
      <span className="text-4xl font-serif capitalize">{value}</span>
    </div>
  );
}
