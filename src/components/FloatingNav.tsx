import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

export function FloatingNav() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const loc = useLocation();

  // Hide nav on editor + auth for immersive focus
  if (loc.pathname.startsWith("/editor") || loc.pathname.startsWith("/auth")) {
    return null;
  }

  const linkCls = (path: string) =>
    `text-sm font-medium transition-colors ${
      loc.pathname === path ? "text-ink" : "text-ink/50 hover:text-ink"
    }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 220 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[min(680px,calc(100vw-2rem))]"
    >
      <div className="flex items-center justify-between rounded-full bg-paper/80 backdrop-blur-md px-4 py-2 ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-serif italic text-xl tracking-tight text-ink">
            Cursive
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <Link to="/" className={linkCls("/")}>
                  Dashboard
                </Link>
                <Link to="/templates" className={linkCls("/templates")}>
                  Templates
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className={linkCls("/admin")}>
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="size-8 grid place-items-center rounded-full hover:bg-ink/5 text-ink/60"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 pl-2">
                <div className="size-7 rounded-full bg-ink text-paper grid place-items-center text-xs font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-ink/70">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-ink/50 hover:text-ink px-2 py-1"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-ink text-paper text-xs font-medium px-4 py-1.5"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
