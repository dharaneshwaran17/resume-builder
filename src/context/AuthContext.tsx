import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { nanoid } from "nanoid";
import type { User } from "../lib/types";

interface StoredUser extends User {
  passwordHash: string;
}

interface AuthCtx {
  user: User | null;
  ready: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "cursive-users";
const SESSION_KEY = "cursive-session";

// Trivial hash — this is a demo without a backend. The real backend uses BCrypt.
function fakeHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return String(h);
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeUsers(u: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {}
    }
    // Ensure a demo admin exists
    const users = readUsers();
    if (!users.find((u) => u.email === "admin@cursive.app")) {
      users.push({
        id: nanoid(8),
        name: "Admin",
        email: "admin@cursive.app",
        role: "admin",
        createdAt: new Date().toISOString(),
        passwordHash: fakeHash("admin123"),
      });
      writeUsers(users);
    }
    setReady(true);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email already registered");
    }
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const u: StoredUser = {
      id: nanoid(8),
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString(),
      passwordHash: fakeHash(password),
    };
    users.push(u);
    writeUsers(users);
    const { passwordHash, ...pub } = u;
    void passwordHash;
    localStorage.setItem(SESSION_KEY, JSON.stringify(pub));
    setUser(pub);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = readUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.passwordHash !== fakeHash(password)) throw new Error("Invalid credentials");
    const { passwordHash, ...pub } = u;
    void passwordHash;
    localStorage.setItem(SESSION_KEY, JSON.stringify(pub));
    setUser(pub);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string, newPassword: string) => {
    const users = readUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) throw new Error("No account with that email");
    if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
    u.passwordHash = fakeHash(newPassword);
    writeUsers(users);
  }, []);

  return (
    <Ctx.Provider value={{ user, ready, signup, login, logout, resetPassword }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
