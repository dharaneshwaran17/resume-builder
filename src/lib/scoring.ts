import type { Resume } from "./types";

export function completionPercent(r: Resume): number {
  let filled = 0;
  let total = 0;
  const check = (v: unknown) => {
    total++;
    if (Array.isArray(v)) {
      if (v.length > 0) filled++;
    } else if (typeof v === "string") {
      if (v.trim().length > 0) filled++;
    } else if (v) filled++;
  };
  check(r.personal.fullName);
  check(r.personal.title);
  check(r.personal.email);
  check(r.personal.phone);
  check(r.personal.location);
  check(r.personal.summary);
  check(r.education);
  check(r.experience);
  check(r.projects);
  check(r.skills.frontend.length + r.skills.backend.length > 0 ? "y" : "");
  check(r.certificates);
  return Math.round((filled / total) * 100);
}

export function atsScore(r: Resume): number {
  const c = completionPercent(r);
  const hasEmail = /@/.test(r.personal.email) ? 10 : 0;
  const hasPhone = r.personal.phone.length > 6 ? 5 : 0;
  const wordCount = r.personal.summary.split(/\s+/).length;
  const summaryScore = wordCount >= 20 && wordCount <= 80 ? 10 : 5;
  return Math.min(100, Math.round(c * 0.75 + hasEmail + hasPhone + summaryScore));
}
