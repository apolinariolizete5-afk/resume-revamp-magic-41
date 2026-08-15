export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

export type Education = {
  id: string;
  course: string;
  school: string;
  period: string;
  description: string;
};

export type Language = {
  id: string;
  name: string;
  level: string;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type Course = {
  id: string;
  name: string;
  provider: string;
  year: string;
};

export type Reference = {
  id: string;
  name: string;
  role: string;
  contact: string;
};

export type CustomSection = {
  id: string;
  title: string;
  content: string;
};

export type CVSectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "certificates"
  | "courses"
  | "references"
  | "custom"
  | "interests";

export type CVData = {
  name: string;
  job: string;
  email: string;
  phone: string;
  location: string;
  link: string;
  photo: string | null;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certificates: Certificate[];
  courses: Course[];
  references: Reference[];
  customSections: CustomSection[];
  interests: string[];
};

export type CVTheme = {
  templateId: string;
  accent: string;
  fontPair: string;
  density: "compacto" | "normal" | "espaçoso";
  hidden: CVSectionKey[];
};

export type CVState = {
  data: CVData;
  theme: CVTheme;
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyCV = (): CVData => ({
  name: "",
  job: "",
  email: "",
  phone: "",
  location: "",
  link: "",
  photo: null,
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  courses: [],
  references: [],
  customSections: [],
  interests: [],
});

export const SECTION_LABELS: Record<CVSectionKey, string> = {
  summary: "Resumo profissional",
  experience: "Experiência",
  education: "Formação",
  skills: "Competências",
  languages: "Idiomas",
  certificates: "Certificados",
  courses: "Cursos",
  references: "Referências",
  custom: "Secções personalizadas",
  interests: "Interesses",
};

export const FONT_PAIRS: Record<string, { heading: string; body: string; label: string }> = {
  moderno: {
    label: "Moderno (Plus Jakarta + Inter)",
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Inter', sans-serif",
  },
  editorial: {
    label: "Editorial (Playfair + Inter)",
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  classico: {
    label: "Clássico (Lora + Source Sans)",
    heading: "'Lora', serif",
    body: "'Source Sans 3', sans-serif",
  },
  tecnico: {
    label: "Técnico (Space Grotesk + Inter)",
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
};

export const ACCENTS = [
  "#1769e0",
  "#0f766e",
  "#b45309",
  "#9333ea",
  "#be123c",
  "#0e7490",
  "#15803d",
  "#1f2937",
];
