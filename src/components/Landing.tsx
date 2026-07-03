import { Link } from "@tanstack/react-router";

export function Landing() {
  return (
    <main className="pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/40">
          A premium resume builder
        </p>
        <h1 className="font-serif text-6xl sm:text-8xl leading-[0.95] tracking-tight text-balance">
          A resume worth <em className="italic">printing.</em>
        </h1>
        <p className="text-lg text-ink/60 max-w-xl mx-auto text-pretty">
          Cursive is the quiet, opinionated resume tool for people who care about typography.
          ATS-friendly. Live preview. One-click PDF.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/auth"
            search={{ mode: "signup" as const }}
            className="rounded-full bg-ink text-paper text-sm font-medium px-6 py-3 hover:-translate-y-px transition-transform"
          >
            Start writing — free
          </Link>
          <Link
            to="/auth"
            search={{ mode: "login" as const }}
            className="rounded-full ring-1 ring-black/10 text-sm font-medium px-6 py-3"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="mt-24 max-w-5xl mx-auto">

        <div className="aspect-[16/10] bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-4 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-5 p-6 space-y-4">
              <p className="text-xs uppercase tracking-widest text-ink/40">Live editor</p>
              <div className="h-8 rounded bg-ink/5" />
              <div className="h-8 rounded bg-ink/5" />
              <div className="h-24 rounded bg-ink/5" />
              <div className="h-8 rounded bg-ink/5" />
            </div>
            <div className="col-span-7 bg-neutral-100 rounded-lg grid place-items-center">
              <div className="w-3/4 aspect-[1/1.414] bg-white shadow-lg p-6 text-[7px]">
                <p className="font-serif text-lg text-center border-b pb-2">Your Name</p>
                <p className="text-center text-neutral-500 text-[6px] uppercase tracking-widest">Job title</p>
                <div className="mt-4 space-y-1">
                  <div className="h-1 bg-neutral-200 w-full" />
                  <div className="h-1 bg-neutral-200 w-11/12" />
                  <div className="h-1 bg-neutral-200 w-4/5" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1">
                    <div className="h-1 bg-neutral-200 w-full" />
                    <div className="h-1 bg-neutral-200 w-3/4" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <div className="h-1 bg-neutral-200 w-full" />
                    <div className="h-1 bg-neutral-200 w-11/12" />
                    <div className="h-1 bg-neutral-200 w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { t: "ATS-friendly", d: "Clean semantic HTML that parses cleanly in any applicant tracking system." },
          { t: "Live preview", d: "Every keystroke updates the A4 preview beside you. No refresh, no wait." },
          { t: "One-click PDF", d: "Export a print-perfect PDF, styled to the pixel by html2pdf." },
        ].map((f) => (
          <div key={f.t}>
            <p className="font-serif text-2xl mb-2">{f.t}</p>
            <p className="text-sm text-ink/60 leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
