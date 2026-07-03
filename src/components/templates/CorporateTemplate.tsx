import type { Resume } from "../../lib/types";

// Corporate template — navy-accented, structured two-column layout aimed at
// traditional enterprise / consulting / finance audiences. ATS-friendly.
export function CorporateTemplate({ resume: r }: { resume: Resume }) {
  const accent = r.accent;
  return (
    <div
      className="w-full h-full bg-white text-neutral-900 text-[10px] leading-relaxed"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Banner header */}
      <header className="px-12 py-8 text-white" style={{ backgroundColor: accent }}>
        <h1
          className="text-3xl tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {r.personal.fullName || "Your Name"}
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] mt-1 opacity-80">
          {r.personal.title || "Job Title"}
        </p>
        <div className="mt-3 text-[9px] flex flex-wrap gap-x-4 gap-y-1 opacity-90">
          {r.personal.email && <span>{r.personal.email}</span>}
          {r.personal.phone && <span>{r.personal.phone}</span>}
          {r.personal.location && <span>{r.personal.location}</span>}
          {r.personal.linkedin && <span>{r.personal.linkedin}</span>}
          {r.personal.portfolio && <span>{r.personal.portfolio}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 px-12 py-8">
        {/* Left column */}
        <aside className="col-span-1 space-y-5">
          {r.personal.summary && (
            <Block title="Executive Summary" accent={accent}>
              <p className="text-[9px] text-neutral-700">{r.personal.summary}</p>
            </Block>
          )}
          {r.education.length > 0 && (
            <Block title="Education" accent={accent}>
              <div className="space-y-2">
                {r.education.map((e) => (
                  <div key={e.id}>
                    <p className="font-semibold text-[10px]">{e.institution}</p>
                    <p className="text-[9px] text-neutral-600">
                      {e.degree}
                      {e.department ? `, ${e.department}` : ""}
                    </p>
                    <p className="text-[8px] text-neutral-500">{e.year}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}
          {(r.skills.frontend.length + r.skills.backend.length + r.skills.tools.length) > 0 && (
            <Block title="Core Competencies" accent={accent}>
              <ul className="space-y-0.5 text-[9px]">
                {[
                  ...r.skills.frontend,
                  ...r.skills.backend,
                  ...r.skills.databases,
                  ...r.skills.tools,
                  ...r.skills.soft,
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span
                      className="inline-block w-1 h-1 mt-1.5 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}
          {r.certificates.length > 0 && (
            <Block title="Certifications" accent={accent}>
              <ul className="space-y-1 text-[9px]">
                {r.certificates.map((c) => (
                  <li key={c.id}>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-neutral-500 text-[8px]">
                      {c.issuer} · {c.year}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </aside>

        {/* Right column */}
        <main className="col-span-2 space-y-6">
          {r.experience.length > 0 && (
            <Block title="Professional Experience" accent={accent}>
              <div className="space-y-4">
                {r.experience.map((e) => (
                  <div
                    key={e.id}
                    className="pl-3 border-l-2"
                    style={{ borderColor: accent }}
                  >
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-[10px]">{e.role}</p>
                      <span className="text-[8px] text-neutral-500 uppercase tracking-wider">
                        {e.duration}
                      </span>
                    </div>
                    <p className="text-[9px] italic text-neutral-600">{e.company}</p>
                    <p className="text-[9px] text-neutral-700 mt-1">{e.description}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}
          {r.projects.length > 0 && (
            <Block title="Key Projects" accent={accent}>
              <div className="space-y-2">
                {r.projects.map((p) => (
                  <div key={p.id}>
                    <p className="font-semibold text-[10px]">{p.name}</p>
                    <p className="text-[9px] text-neutral-700">{p.description}</p>
                    {p.tech && (
                      <p className="text-[8px] text-neutral-500">{p.tech}</p>
                    )}
                  </div>
                ))}
              </div>
            </Block>
          )}
          {r.achievements.length > 0 && (
            <Block title="Achievements" accent={accent}>
              <ul className="list-disc list-inside space-y-0.5 text-[9px] text-neutral-700">
                {r.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </Block>
          )}
        </main>
      </div>
    </div>
  );
}

function Block({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p
        className="text-[9px] font-semibold uppercase tracking-[0.25em] pb-1 mb-2 border-b"
        style={{ color: accent, borderColor: accent + "30" }}
      >
        {title}
      </p>
      {children}
    </section>
  );
}
