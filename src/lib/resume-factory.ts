import { nanoid } from "nanoid";
import type { Resume } from "./types";

export function emptyResume(name = "Untitled Resume"): Resume {
  const now = new Date().toISOString();
  return {
    id: nanoid(10),
    name,
    template: "classic",
    accent: "#1c1917",
    createdAt: now,
    updatedAt: now,
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      languages: [],
      frontend: [],
      backend: [],
      databases: [],
      tools: [],
      soft: [],
    },
    certificates: [],
    achievements: [],
    languages: [],
    hobbies: [],
    downloads: 0,
  };
}

export function seedResume(): Resume {
  const r = emptyResume("Elias — Product Designer 2024");
  r.personal = {
    fullName: "Elias Vanderbilt",
    title: "Senior Product Designer",
    email: "elias@vanderbilt.com",
    phone: "+1 415 555 0192",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/elias",
    github: "github.com/elias",
    portfolio: "elias.design",
    summary:
      "Multidisciplinary designer with 8 years of experience building digital products at the intersection of commerce and culture.",
  };
  r.experience = [
    {
      id: nanoid(6),
      company: "Linear",
      role: "Lead Designer",
      duration: "2021 — Present",
      description:
        "Driving visual direction for the core issue tracking experience. Established the next generation of mobile design patterns.",
    },
    {
      id: nanoid(6),
      company: "Stripe",
      role: "Product Designer",
      duration: "2018 — 2021",
      description:
        "Shipped the unified billing dashboard used by over 2M merchants globally.",
    },
  ];
  r.education = [
    {
      id: nanoid(6),
      institution: "Rhode Island School of Design",
      degree: "BFA",
      department: "Graphic Design",
      cgpa: "3.9",
      year: "2014 — 2018",
    },
  ];
  r.projects = [
    {
      id: nanoid(6),
      name: "Type Atlas",
      description: "Open-source typographic reference for interface designers.",
      tech: "React, TypeScript, Figma Plugin API",
      github: "github.com/elias/type-atlas",
      live: "typeatlas.dev",
    },
  ];
  r.skills = {
    languages: ["English", "Italian"],
    frontend: ["React", "TypeScript", "Tailwind"],
    backend: ["Node.js", "Postgres"],
    databases: ["Postgres", "Redis"],
    tools: ["Figma", "Linear", "Notion"],
    soft: ["Systems thinking", "Cross-functional leadership"],
  };
  r.certificates = [
    { id: nanoid(6), name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" },
  ];
  r.achievements = ["Awwwards Site of the Day, 2022"];
  r.hobbies = ["Letterpress printing", "Analog photography"];
  r.downloads = 12;
  return r;
}
