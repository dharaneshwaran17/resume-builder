import type { Resume } from "../../lib/types";

export function ModernTemplate({ resume: r }: { resume: Resume }) {
  const accent = r.accent;
  return (
    <div className="w-full h-full bg-white text-neutral-900 p-12 font-sans text-[10px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: accent }}>
            {r.personal.fullName || "Your Name"}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">{r.personal.title}</p>
        </div>
        <div className="text-right text-[9px] text-neutral-600 space-y-0.5">
          {r.personal.email && <p>{r.personal.email}</p>}
          {r.personal.phone && <p>{r.personal.phone}</p>}
          {r.personal.location && <p>{r.personal.location}</p>}
          {r.personal.linkedin && <p>{r.personal.linkedin}</p>}
          {r.personal.github && <p>{r.personal.github}</p>}
        </div>
      </div>

      {r.personal.summary && (
        <p className="text-[10px] text-neutral-700 mb-6 leading-relaxed">{r.personal.summary}</p>
      )}

      {r.experience.length > 0 && <Block title="Experience" accent={accent}>
        {r.experience.map((e) => (
          <div key={e.id} className="mb-3">
            <div className="flex justify-between font-semibold text-[10px]">
              <span>{e.role} at {e.company}</span>
              <span className="text-neutral-500 font-normal">{e.duration}</span>
            </div>
            <p className="text-[9px] text-neutral-700 mt-0.5">{e.description}</p>
          </div>
        ))}
      </Block>}

      {r.projects.length > 0 && <Block title="Projects" accent={accent}>
        {r.projects.map((p) => (
          <div key={p.id} className="mb-2">
            <p className="font-semibold text-[10px]">{p.name} <span className="text-[8px] text-neutral-500 font-normal italic">— {p.tech}</span></p>
            <p className="text-[9px] text-neutral-700">{p.description}</p>
          </div>
        ))}
      </Block>}

      {r.education.length > 0 && <Block title="Education" accent={accent}>
        {r.education.map((e) => (
          <div key={e.id} className="flex justify-between mb-1 text-[10px]">
            <span><span className="font-semibold">{e.institution}</span> — {e.degree}{e.department ? `, ${e.department}` : ""}</span>
            <span className="text-neutral-500">{e.year}</span>
          </div>
        ))}
      </Block>}

      {(r.skills.frontend.length + r.skills.backend.length > 0) && (
        <Block title="Skills" accent={accent}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[9px]">
            {r.skills.frontend.length > 0 && <p><b>Frontend:</b> {r.skills.frontend.join(", ")}</p>}
            {r.skills.backend.length > 0 && <p><b>Backend:</b> {r.skills.backend.join(", ")}</p>}
            {r.skills.databases.length > 0 && <p><b>Databases:</b> {r.skills.databases.join(", ")}</p>}
            {r.skills.tools.length > 0 && <p><b>Tools:</b> {r.skills.tools.join(", ")}</p>}
          </div>
        </Block>
      )}
    </div>
  );
}
function Block({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b" style={{ color: accent, borderColor: accent + "30" }}>{title}</h2>
      {children}
    </section>
  );
}
