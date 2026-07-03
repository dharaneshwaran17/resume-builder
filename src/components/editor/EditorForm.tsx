import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { Resume } from "../../lib/types";

interface Props {
  resume: Resume;
  onChange: (patch: Partial<Resume> | ((r: Resume) => Resume)) => void;
}

export function EditorForm({ resume, onChange }: Props) {
  const personal = resume.personal;

  const setPersonal = (patch: Partial<Resume["personal"]>) =>
    onChange((r) => ({ ...r, personal: { ...r.personal, ...patch } }));

  return (
    <div className="space-y-10">
      {/* Personal */}
      <Section title="Profile">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Full name" value={personal.fullName} onChange={(v) => setPersonal({ fullName: v })} />
          <TextField label="Job title" value={personal.title} onChange={(v) => setPersonal({ title: v })} />
          <TextField label="Email" type="email" value={personal.email} onChange={(v) => setPersonal({ email: v })} />
          <TextField label="Phone" value={personal.phone} onChange={(v) => setPersonal({ phone: v })} />
          <TextField label="Location" value={personal.location} onChange={(v) => setPersonal({ location: v })} />
          <TextField label="LinkedIn" value={personal.linkedin} onChange={(v) => setPersonal({ linkedin: v })} />
          <TextField label="GitHub" value={personal.github} onChange={(v) => setPersonal({ github: v })} />
          <TextField label="Portfolio" value={personal.portfolio} onChange={(v) => setPersonal({ portfolio: v })} />
        </div>
        <TextArea
          label="Professional summary"
          value={personal.summary}
          onChange={(v) => setPersonal({ summary: v })}
        />
      </Section>

      {/* Experience */}
      <ArraySection
        title="Experience"
        items={resume.experience}
        onAdd={() =>
          onChange((r) => ({
            ...r,
            experience: [
              ...r.experience,
              { id: nanoid(6), company: "", role: "", duration: "", description: "" },
            ],
          }))
        }
        onRemove={(id) =>
          onChange((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }))
        }
        renderItem={(e, i) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Role" value={e.role} onChange={(v) => onChange((r) => ({
                ...r, experience: r.experience.map((x, k) => k === i ? { ...x, role: v } : x),
              }))} />
              <TextField label="Company" value={e.company} onChange={(v) => onChange((r) => ({
                ...r, experience: r.experience.map((x, k) => k === i ? { ...x, company: v } : x),
              }))} />
            </div>
            <TextField label="Duration" value={e.duration} onChange={(v) => onChange((r) => ({
              ...r, experience: r.experience.map((x, k) => k === i ? { ...x, duration: v } : x),
            }))} />
            <TextArea label="Description" value={e.description} onChange={(v) => onChange((r) => ({
              ...r, experience: r.experience.map((x, k) => k === i ? { ...x, description: v } : x),
            }))} />
          </>
        )}
      />

      {/* Education */}
      <ArraySection
        title="Education"
        items={resume.education}
        onAdd={() =>
          onChange((r) => ({
            ...r,
            education: [
              ...r.education,
              { id: nanoid(6), institution: "", degree: "", department: "", cgpa: "", year: "" },
            ],
          }))
        }
        onRemove={(id) => onChange((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }))}
        renderItem={(e, i) => (
          <>
            <TextField label="Institution" value={e.institution} onChange={(v) => onChange((r) => ({
              ...r, education: r.education.map((x, k) => k === i ? { ...x, institution: v } : x),
            }))} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Degree" value={e.degree} onChange={(v) => onChange((r) => ({
                ...r, education: r.education.map((x, k) => k === i ? { ...x, degree: v } : x),
              }))} />
              <TextField label="Department" value={e.department} onChange={(v) => onChange((r) => ({
                ...r, education: r.education.map((x, k) => k === i ? { ...x, department: v } : x),
              }))} />
              <TextField label="CGPA / %" value={e.cgpa} onChange={(v) => onChange((r) => ({
                ...r, education: r.education.map((x, k) => k === i ? { ...x, cgpa: v } : x),
              }))} />
              <TextField label="Year" value={e.year} onChange={(v) => onChange((r) => ({
                ...r, education: r.education.map((x, k) => k === i ? { ...x, year: v } : x),
              }))} />
            </div>
          </>
        )}
      />

      {/* Projects */}
      <ArraySection
        title="Projects"
        items={resume.projects}
        onAdd={() =>
          onChange((r) => ({
            ...r,
            projects: [
              ...r.projects,
              { id: nanoid(6), name: "", description: "", tech: "", github: "", live: "" },
            ],
          }))
        }
        onRemove={(id) => onChange((r) => ({ ...r, projects: r.projects.filter((p) => p.id !== id) }))}
        renderItem={(p, i) => (
          <>
            <TextField label="Project name" value={p.name} onChange={(v) => onChange((r) => ({
              ...r, projects: r.projects.map((x, k) => k === i ? { ...x, name: v } : x),
            }))} />
            <TextField label="Tech used" value={p.tech} onChange={(v) => onChange((r) => ({
              ...r, projects: r.projects.map((x, k) => k === i ? { ...x, tech: v } : x),
            }))} />
            <TextArea label="Description" value={p.description} onChange={(v) => onChange((r) => ({
              ...r, projects: r.projects.map((x, k) => k === i ? { ...x, description: v } : x),
            }))} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="GitHub URL" value={p.github} onChange={(v) => onChange((r) => ({
                ...r, projects: r.projects.map((x, k) => k === i ? { ...x, github: v } : x),
              }))} />
              <TextField label="Live URL" value={p.live} onChange={(v) => onChange((r) => ({
                ...r, projects: r.projects.map((x, k) => k === i ? { ...x, live: v } : x),
              }))} />
            </div>
          </>
        )}
      />

      {/* Skills */}
      <Section title="Skills">
        <div className="grid grid-cols-1 gap-3">
          <ChipField
            label="Frontend"
            values={resume.skills.frontend}
            onChange={(v) => onChange((r) => ({ ...r, skills: { ...r.skills, frontend: v } }))}
          />
          <ChipField
            label="Backend"
            values={resume.skills.backend}
            onChange={(v) => onChange((r) => ({ ...r, skills: { ...r.skills, backend: v } }))}
          />
          <ChipField
            label="Databases"
            values={resume.skills.databases}
            onChange={(v) => onChange((r) => ({ ...r, skills: { ...r.skills, databases: v } }))}
          />
          <ChipField
            label="Tools"
            values={resume.skills.tools}
            onChange={(v) => onChange((r) => ({ ...r, skills: { ...r.skills, tools: v } }))}
          />
          <ChipField
            label="Languages"
            values={resume.skills.languages}
            onChange={(v) => onChange((r) => ({ ...r, skills: { ...r.skills, languages: v } }))}
          />
          <ChipField
            label="Soft skills"
            values={resume.skills.soft}
            onChange={(v) => onChange((r) => ({ ...r, skills: { ...r.skills, soft: v } }))}
          />
        </div>
      </Section>

      {/* Certificates */}
      <ArraySection
        title="Certificates"
        items={resume.certificates}
        onAdd={() =>
          onChange((r) => ({
            ...r,
            certificates: [
              ...r.certificates,
              { id: nanoid(6), name: "", issuer: "", year: "" },
            ],
          }))
        }
        onRemove={(id) => onChange((r) => ({ ...r, certificates: r.certificates.filter((c) => c.id !== id) }))}
        renderItem={(c, i) => (
          <>
            <TextField label="Certificate" value={c.name} onChange={(v) => onChange((r) => ({
              ...r, certificates: r.certificates.map((x, k) => k === i ? { ...x, name: v } : x),
            }))} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Issuer" value={c.issuer} onChange={(v) => onChange((r) => ({
                ...r, certificates: r.certificates.map((x, k) => k === i ? { ...x, issuer: v } : x),
              }))} />
              <TextField label="Year" value={c.year} onChange={(v) => onChange((r) => ({
                ...r, certificates: r.certificates.map((x, k) => k === i ? { ...x, year: v } : x),
              }))} />
            </div>
          </>
        )}
      />

      <Section title="Extras">
        <ChipField
          label="Achievements"
          values={resume.achievements}
          onChange={(v) => onChange({ achievements: v })}
        />
        <ChipField
          label="Languages spoken"
          values={resume.languages}
          onChange={(v) => onChange({ languages: v })}
        />
        <ChipField
          label="Hobbies"
          values={resume.hobbies}
          onChange={(v) => onChange({ hobbies: v })}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ArraySection<T extends { id: string }>({
  title,
  items,
  onAdd,
  onRemove,
  renderItem,
}: {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif">{title}</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs font-medium text-ink/60 hover:text-ink px-2 py-1"
        >
          <FiPlus size={12} /> Add
        </button>
      </div>
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="p-4 rounded-xl ring-1 ring-black/5 bg-zinc-50/40 space-y-3 relative"
          >
            <button
              onClick={() => onRemove(item.id)}
              className="absolute top-3 right-3 text-ink/40 hover:text-red-600"
              aria-label="Remove"
            >
              <FiTrash2 size={13} />
            </button>
            {renderItem(item, i)}
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-ink/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-transparent ring-1 ring-black/10 rounded-md text-sm focus:ring-ink outline-none transition-shadow"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-ink/50">
        {label}{" "}
        <span className="text-ink/30 float-right normal-case">{value.length} chars</span>
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-24 px-3 py-2 bg-transparent ring-1 ring-black/10 rounded-md text-sm focus:ring-ink outline-none transition-shadow"
      />
    </label>
  );
}

function ChipField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-ink/50">{label} <span className="text-ink/30">— comma separated</span></span>
      <input
        value={values.join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        className="w-full px-3 py-2 bg-transparent ring-1 ring-black/10 rounded-md text-sm focus:ring-ink outline-none transition-shadow"
      />
    </label>
  );
}
