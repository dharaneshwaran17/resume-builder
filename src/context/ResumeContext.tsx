import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { nanoid } from "nanoid";
import type { Resume } from "../lib/types";
import { emptyResume, seedResume } from "../lib/resume-factory";
import { useAuth } from "./AuthContext";

interface ResumeCtx {
  resumes: Resume[];
  create: (name?: string) => Resume;
  update: (id: string, patch: Partial<Resume> | ((r: Resume) => Resume)) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => Resume | null;
  incrementDownloads: (id: string) => void;
  get: (id: string) => Resume | undefined;
}
const Ctx = createContext<ResumeCtx | null>(null);

function key(userId: string | null) {
  return `cursive-resumes:${userId ?? "guest"}`;
}

function read(userId: string | null): Resume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  // seed once per user
  const seeded = [seedResume()];
  if (typeof window !== "undefined") {
    localStorage.setItem(key(userId), JSON.stringify(seeded));
  }
  return seeded;
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    setResumes(read(user?.id ?? null));
  }, [user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key(user?.id ?? null), JSON.stringify(resumes));
  }, [resumes, user?.id]);

  const create = useCallback((name = "Untitled Resume"): Resume => {
    const r = emptyResume(name);
    setResumes((prev) => [r, ...prev]);
    return r;
  }, []);

  const update = useCallback(
    (id: string, patch: Partial<Resume> | ((r: Resume) => Resume)) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const next = typeof patch === "function" ? patch(r) : { ...r, ...patch };
          next.updatedAt = new Date().toISOString();
          return next;
        }),
      );
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const duplicate = useCallback((id: string): Resume | null => {
    const src = resumes.find((r) => r.id === id);
    if (!src) return null;
    const copy: Resume = {
      ...src,
      id: nanoid(10),
      name: `${src.name} (copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
    };
    setResumes((prev) => [copy, ...prev]);
    return copy;
  }, [resumes]);

  const incrementDownloads = useCallback((id: string) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r)),
    );
  }, []);

  const get = useCallback((id: string) => resumes.find((r) => r.id === id), [resumes]);

  const value = useMemo(
    () => ({ resumes, create, update, remove, duplicate, incrementDownloads, get }),
    [resumes, create, update, remove, duplicate, incrementDownloads, get],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useResumes() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useResumes outside provider");
  return c;
}
