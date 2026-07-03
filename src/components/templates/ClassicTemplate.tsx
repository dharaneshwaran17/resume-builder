import type { Resume } from "../../lib/types";

interface Props {
  resume: Resume;
}

export function ClassicTemplate({ resume: r }: Props) {
  const accent = r.accent;
  return (
    <div className="w-full h-full bg-white text-neutral-900 p-12 font-sans text-[10px] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="text-center border-b pb-6 mb-6" style={{ borderColor: accent + "20" }}>
        <h1 className="text-3xl tracking-tight mb-1" style={{ fontFamily: "'Instrument Serif', serif", color: accent }}>
          {r.personal.fullName || "Your Name"}
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          {r.personal.title || "Job Title"}
          {r.personal.location ? ` • ${r.personal.location}` : ""}
        </p>
        <div className="mt-2 text-[9px] text-neutral-600 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {r.personal.email && <span>{r.personal.email}</span>}
          {r.personal.phone && <span>{r.personal.phone}</span>}
          {r.personal.linkedin && <span>{r.personal.linkedin}</span>}
          {r.personal.github && <span>{r.personal.github}</span>}
          {r.personal.portfolio && <span>{r.personal.portfolio}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <aside className="col-span-1 space-y-5">
          {r.personal.summary && (
            <Section title="Profile" accent={accent}>
              <p className="text-[9px] text-neutral-700">{r.personal.summary}</p>
            </Section>
          )}
          {(r.skills.frontend.length + r.skills.backend.length + r.skills.tools.length > 0) && (
            <Section title="Skills" accent={accent}>
              <SkillList label="Frontend" items={r.skills.frontend} />
              <SkillList label="Backend" items={r.skills.backend} />
              <SkillList label="Databases" items={r.skills.databases} />
              <SkillList label="Tools" items={r.skills.tools} />
              <SkillList label="Languages" items={r.skills.languages} />
            </Section>
          )}
          {r.languages.length > 0 && (
            <Section title="Languages" accent={accent}>
              <ul className="space-y-0.5 text-[9px]">
                {r.languages.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </Section>
          )}
        </aside>

        <main className="col-span-2 space-y-5">
          {r.experience.length > 0 && (
            <Section title="Experience" accent={accent}>
              <div className="space-y-3">
                {r.experience.map((e) => (
                  <div key={e.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-[10px]">{e.role} — {e.company}</p>
                      <span className="text-[8px] text-neutral-500">{e.duration}</span>
                    </div>
                    <p className="text-[9px] text-neutral-700 mt-0.5">{e.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {r.projects.length > 0 && (
            <Section title="Projects" accent={accent}>
              <div className="space-y-3">
                {r.projects.map((p) => (
                  <div key={p.id}>
                    <p className="font-semibold text-[10px]">{p.name}</p>
                    <p className="text-[9px] text-neutral-700">{p.description}</p>
                    {p.tech && <p className="text-[8px] text-neutral-500 italic">{p.tech}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}
          {r.education.length > 0 && (
            <Section title="Education" accent={accent}>
              <div className="space-y-2">
                {r.education.map((e) => (
                  <div key={e.id} className="flex justify-between items-baseline">
                    <div>
                      <p className="font-semibold text-[10px]">{e.institution}</p>
                      <p className="text-[9px] text-neutral-600">{e.degree}{e.department ? `, ${e.department}` : ""}{e.cgpa ? ` — CGPA ${e.cgpa}` : ""}</p>
                    </div>
                    <span className="text-[8px] text-neutral-500">{e.year}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {r.certificates.length > 0 && (
            <Section title="Certificates" accent={accent}>
              <ul className="space-y-1 text-[9px]">
                {r.certificates.map((c) => (
                  <li key={c.id}>{c.name} — <span className="text-neutral-500">{c.issuer}, {c.year}</span></li>
                ))}
              </ul>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>{title}</p>
      {children}
    </section>
  );
}
function SkillList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mb-2">
      <p className="text-[8px] uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="text-[9px]">{items.join(" · ")}</p>
    </div>
  );
}
