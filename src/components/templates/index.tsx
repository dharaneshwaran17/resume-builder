import type { Resume, TemplateId } from "../../lib/types";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { CorporateTemplate } from "./CorporateTemplate";

export const TEMPLATES: { id: TemplateId; name: string; blurb: string }[] = [
  { id: "classic", name: "Classic", blurb: "Serif-led, ATS-friendly, two-column." },
  { id: "modern", name: "Modern", blurb: "Bold header, accent rules, single column." },
  { id: "minimal", name: "Minimal", blurb: "Editorial serif, generous whitespace." },
  { id: "corporate", name: "Corporate", blurb: "Banner header, structured for enterprise roles." },
];

export function ResumeRenderer({ resume }: { resume: Resume }) {
  switch (resume.template) {
    case "modern":
      return <ModernTemplate resume={resume} />;
    case "minimal":
      return <MinimalTemplate resume={resume} />;
    case "corporate":
      return <CorporateTemplate resume={resume} />;
    case "classic":
    default:
      return <ClassicTemplate resume={resume} />;
  }
}

