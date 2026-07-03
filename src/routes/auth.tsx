import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/Toaster";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Cursive" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { user, ready, login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        await signup(name.trim(), email.trim(), password);
        toast("Welcome to Cursive.", "success");
      } else if (mode === "login") {
        await login(email.trim(), password);
        toast("Signed in.", "success");
      } else {
        await resetPassword(email.trim(), password);
        toast("Password reset. You can sign in now.", "success");
        navigate({ to: "/auth", search: { mode: "login" } });
      }
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper text-ink">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-ink text-paper">
        <Link to="/" className="font-serif italic text-2xl">Cursive</Link>
        <div className="space-y-6">
          <p className="font-serif text-5xl leading-tight text-balance">
            "The best resume I've written in ten years. Actually enjoyable."
          </p>
          <p className="text-sm text-paper/60">— Beta user, San Francisco</p>
        </div>
        <p className="text-xs text-paper/40 uppercase tracking-widest">
          Demo admin: admin@cursive.app / admin123
        </p>
      </div>

      <div className="flex items-center justify-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="w-full max-w-sm space-y-6"
        >
          <div>
            <h1 className="font-serif text-4xl mb-1">
              {mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back"}
            </h1>
            <p className="text-sm text-ink/50">
              {mode === "signup"
                ? "Start crafting your resume in seconds."
                : mode === "forgot"
                  ? "Enter your email and a new password."
                  : "Sign in to continue where you left off."}
            </p>
          </div>

          {mode === "signup" && (
            <Field label="Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent ring-1 ring-black/10 rounded-md text-sm focus:ring-ink outline-none"
              />
            </Field>
          )}

          <Field label="Email">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-transparent ring-1 ring-black/10 rounded-md text-sm focus:ring-ink outline-none"
            />
          </Field>

          <Field label={mode === "forgot" ? "New password" : "Password"}>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-transparent ring-1 ring-black/10 rounded-md text-sm focus:ring-ink outline-none"
            />
          </Field>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-ink text-paper text-sm font-medium py-3 disabled:opacity-50"
          >
            {busy ? "…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Sign in"}
          </button>

          <div className="text-xs text-ink/50 flex justify-between">
            {mode !== "signup" ? (
              <Link to="/auth" search={{ mode: "signup" }} className="underline underline-offset-4">
                Create account
              </Link>
            ) : (
              <Link to="/auth" search={{ mode: "login" }} className="underline underline-offset-4">
                Sign in instead
              </Link>
            )}
            {mode !== "forgot" && (
              <Link to="/auth" search={{ mode: "forgot" }} className="underline underline-offset-4">
                Forgot password?
              </Link>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-ink/50">{label}</span>
      {children}
    </label>
  );
}
