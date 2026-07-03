import type { Resume } from "../../lib/types";

export function MinimalTemplate({ resume: r }: { resume: Resume }) {
  const accent = r.accent;
  return (
    <div className="w-full h-full bg-white text-neutral-900 p-14 font-sans text-[10px]" style={{ fontFamily: "'Instrument Serif', serif" }}>
      <h1 className="text-5xl tracking-tight" style={{ color: accent }}>{r.personal.fullName || "Your Name"}</h1>
      <p className="text-sm text-neutral-500 mt-1 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{r.personal.title}</p>
      <p className="text-[9px] text-neutral-500 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
        {[r.personal.email, r.personal.phone, r.personal.location, r.personal.linkedin].filter(Boolean).join("  ·  ")}
      </p>

      {r.personal.summary && (
        <p className="text-[10px] text-neutral-700 leading-relaxed mb-8 max-w-prose italic">{r.personal.summary}</p>
      )}

      {r.experience.length > 0 && <MinSection title="Experience" accent={accent}>
        {r.experience.map((e) => (
          <div key={e.id} className="mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="text-[10px]"><b>{e.role}</b>, {e.company} <span className="text-neutral-400">— {e.duration}</span></p>
            <p className="text-[9px] text-neutral-600 mt-0.5">{e.description}</p>
          </div>
        ))}
      </MinSection>}

      {r.projects.length > 0 && <MinSection title="Projects" accent={accent}>
        {r.projects.map((p) => (
          <div key={p.id} className="mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="text-[10px]"><b>{p.name}</b> <span className="text-neutral-400 italic">— {p.tech}</span></p>
            <p className="text-[9px] text-neutral-600">{p.description}</p>
          </div>
        ))}
      </MinSection>}

      {r.education.length > 0 && <MinSection title="Education" accent={accent}>
        {r.education.map((e) => (
          <p key={e.id} className="text-[10px] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            <b>{e.institution}</b>, {e.degree} <span className="text-neutral-400">— {e.year}</span>
          </p>
        ))}
      </MinSection>}

      {(r.skills.frontend.length + r.skills.backend.length > 0) && (
        <MinSection title="Skills" accent={accent}>
          <p className="text-[10px] text-neutral-700" style={{ fontFamily: "'Inter', sans-serif" }}>
            {[...r.skills.frontend, ...r.skills.backend, ...r.skills.databases, ...r.skills.tools].join(" · ")}
          </p>
        </MinSection>
      )}
    </div>
  );
}

function MinSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: accent, fontFamily: "'Inter', sans-serif" }}>— {title}</p>
      {children}
    </section>
  );
}
