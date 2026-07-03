import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ResumeProvider } from "../context/ResumeContext";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { FloatingNav } from "../components/FloatingNav";
import { Toaster } from "../components/Toaster";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper text-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <h2 className="mt-4 text-lg">Page not found</h2>
        <p className="mt-2 text-sm text-ink/50">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "root" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper text-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">Something went sideways.</h1>
        <p className="mt-3 text-sm text-ink/50">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full ring-1 ring-black/10 px-4 py-2 text-sm"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cursive — Premium Resume Builder" },
      {
        name: "description",
        content:
          "Craft an ATS-friendly, beautifully typeset resume in minutes. Live preview, premium templates, one-click PDF.",
      },
      { property: "og:title", content: "Cursive — Premium Resume Builder" },
      {
        property: "og:description",
        content:
          "Craft an ATS-friendly, beautifully typeset resume in minutes. Live preview, premium templates, one-click PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cursive — Premium Resume Builder" },
      { name: "description", content: "ResumeCraft Pro is a modern web application for creating, managing, and downloading professional resumes." },
      { property: "og:description", content: "ResumeCraft Pro is a modern web application for creating, managing, and downloading professional resumes." },
      { name: "twitter:description", content: "ResumeCraft Pro is a modern web application for creating, managing, and downloading professional resumes." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2ce6c9b-6c45-4eff-9c7a-808d759a31ee/id-preview-0d1cdfa4--56dc5f6e-5f37-4c3e-81c5-17e2c8a8ef24.lovable.app-1782975506689.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2ce6c9b-6c45-4eff-9c7a-808d759a31ee/id-preview-0d1cdfa4--56dc5f6e-5f37-4c3e-81c5-17e2c8a8ef24.lovable.app-1782975506689.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ResumeProvider>
            <FloatingNav />
            <Outlet />
            <Toaster />
          </ResumeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
