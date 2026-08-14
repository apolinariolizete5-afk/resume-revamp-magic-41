import type { CVData } from "./types";

export const sampleCV: CVData = {
  name: "Amélia Nhamirre",
  job: "Gestora de Marketing Digital",
  email: "amelia.nhamirre@email.co.mz",
  phone: "+258 84 512 3390",
  location: "Maputo, Moçambique",
  link: "linkedin.com/in/amelianhamirre",
  photo: null,
  summary:
    "Profissional de marketing com 7 anos de experiência em campanhas digitais para o mercado moçambicano. Especialista em gestão de redes sociais, campanhas pagas e análise de dados, com histórico comprovado de crescimento de audiência e vendas em empresas de retalho e telecomunicações.",
  experiences: [
    {
      id: "e1",
      role: "Gestora de Marketing Digital",
      company: "Rede Moçambique, Maputo",
      period: "2022 — Presente",
      description:
        "Lidero uma equipa de 5 pessoas na estratégia digital da marca.\nAumentei o alcance orgânico em 180% em 18 meses.\nGiro um orçamento anual de 4,5 milhões de MT em campanhas pagas.",
    },
    {
      id: "e2",
      role: "Especialista em Redes Sociais",
      company: "Grupo Zambeze, Beira",
      period: "2019 — 2022",
      description:
        "Criei o calendário editorial de 6 marcas do grupo.\nDupliquei a taxa de conversão das campanhas de Facebook e Instagram.\nFormei 20 colaboradores em comunicação digital.",
    },
    {
      id: "e3",
      role: "Assistente de Comunicação",
      company: "Fundação Kulima",
      period: "2017 — 2019",
      description:
        "Produção de conteúdos institucionais e relatórios para parceiros internacionais.",
    },
  ],
  education: [
    {
      id: "f1",
      course: "Licenciatura em Comunicação Social",
      school: "Universidade Eduardo Mondlane",
      period: "2013 — 2017",
      description: "Especialização em Publicidade e Relações Públicas.",
    },
    {
      id: "f2",
      course: "Pós-graduação em Marketing Digital",
      school: "ISCTEM",
      period: "2020 — 2021",
      description: "",
    },
  ],
  skills: [
    "Estratégia digital",
    "Google Ads",
    "Meta Business Suite",
    "SEO",
    "Google Analytics",
    "Copywriting",
    "Gestão de equipas",
    "Canva & Figma",
  ],
  languages: [
    { id: "l1", name: "Português", level: "Nativo" },
    { id: "l2", name: "Inglês", level: "Avançado" },
    { id: "l3", name: "Changana", level: "Fluente" },
    { id: "l4", name: "Espanhol", level: "Básico" },
  ],
  certificates: [
    { id: "c1", name: "Google Ads Search Certification", issuer: "Google", year: "2024" },
    { id: "c2", name: "Gestão de Projectos", issuer: "PMI Moçambique", year: "2023" },
  ],
  interests: ["Fotografia", "Mentoria de jovens", "Corrida", "Literatura moçambicana"],
};

export const sampleVariants: Record<string, Partial<CVData>> = {
  b: {
    name: "Hélder Cumbane",
    job: "Engenheiro Civil",
    email: "helder.cumbane@email.co.mz",
    phone: "+258 82 447 1120",
    location: "Matola, Moçambique",
    link: "linkedin.com/in/heldercumbane",
  },
  c: {
    name: "Isaura Machava",
    job: "Contabilista Sénior",
    email: "isaura.machava@email.co.mz",
    phone: "+258 87 220 8845",
    location: "Nampula, Moçambique",
    link: "linkedin.com/in/isauramachava",
  },
};
