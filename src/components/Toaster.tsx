import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";

type Toast = { id: string; msg: string; kind: "info" | "success" | "error" };

type Listener = (t: Toast) => void;
const listeners = new Set<Listener>();

export function toast(msg: string, kind: Toast["kind"] = "info") {
  const t: Toast = { id: nanoid(6), msg, kind };
  listeners.forEach((l) => l(t));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const l: Listener = (t) => {
      setToasts((cur) => [...cur, t]);
      setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== t.id)), 2600);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className={`pointer-events-auto rounded-xl px-4 py-2.5 text-sm shadow-2xl ring-1 ring-black/10 max-w-xs ${
              t.kind === "error"
                ? "bg-red-600 text-white"
                : t.kind === "success"
                  ? "bg-emerald-700 text-white"
                  : "bg-ink text-paper"
            }`}
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
