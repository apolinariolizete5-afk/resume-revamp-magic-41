import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash";

async function chat(system: string, user: string, json: boolean) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Serviço de IA indisponível.");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Muitos pedidos de IA. Tente novamente daqui a pouco.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados.");
    throw new Error(`Falha na IA: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

const PARSE_SYSTEM = `És um extractor de dados de currículos. Recebes o texto bruto de um CV e devolves APENAS JSON válido com esta forma exacta:
{"name":"","job":"","email":"","phone":"","location":"","link":"","summary":"","experiences":[{"role":"","company":"","period":"","description":""}],"education":[{"course":"","school":"","period":"","description":""}],"skills":[""],"languages":[{"name":"","level":""}],"certificates":[{"name":"","issuer":"","year":""}],"courses":[{"name":"","provider":"","year":""}],"references":[{"name":"","role":"","contact":""}],"interests":[""]}
Regras: escreve em português de Moçambique; não inventes dados que não existam (usa string vazia ou lista vazia); em "description" usa uma frase por linha separada por \\n; mantém as datas tal como aparecem.`;

const parsedSchema = z.object({
  name: z.string().default(""),
  job: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  link: z.string().default(""),
  summary: z.string().default(""),
  experiences: z
    .array(
      z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        period: z.string().default(""),
        description: z.string().default(""),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        course: z.string().default(""),
        school: z.string().default(""),
        period: z.string().default(""),
        description: z.string().default(""),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  languages: z
    .array(z.object({ name: z.string().default(""), level: z.string().default("") }))
    .default([]),
  certificates: z
    .array(
      z.object({
        name: z.string().default(""),
        issuer: z.string().default(""),
        year: z.string().default(""),
      }),
    )
    .default([]),
  courses: z
    .array(
      z.object({
        name: z.string().default(""),
        provider: z.string().default(""),
        year: z.string().default(""),
      }),
    )
    .default([]),
  references: z
    .array(
      z.object({
        name: z.string().default(""),
        role: z.string().default(""),
        contact: z.string().default(""),
      }),
    )
    .default([]),
  interests: z.array(z.string()).default([]),
});

export type ParsedCV = z.infer<typeof parsedSchema>;

export const parseCVText = createServerFn({ method: "POST" })
  .inputValidator((input: { text: string }) => z.object({ text: z.string().min(20) }).parse(input))
  .handler(async ({ data }): Promise<ParsedCV> => {
    const content = await chat(PARSE_SYSTEM, data.text.slice(0, 24000), true);
    const raw = (() => {
      try {
        return JSON.parse(content) as unknown;
      } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]) as unknown;
        throw new Error("Não foi possível ler o conteúdo do CV.");
      }
    })();
    return parsedSchema.parse(raw);
  });

export const writeSummary = createServerFn({ method: "POST" })
  .inputValidator((input: { job: string; context: string; current: string }) =>
    z
      .object({ job: z.string(), context: z.string(), current: z.string() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const text = await chat(
      "És um especialista em recrutamento em Moçambique. Escreves resumos profissionais de CV em português europeu/moçambicano, na primeira pessoa implícita, sem clichés vazios, entre 45 e 70 palavras. Devolve apenas o texto do resumo.",
      `Cargo pretendido: ${data.job || "não indicado"}\nResumo actual: ${data.current || "(vazio)"}\nContexto do candidato:\n${data.context.slice(0, 6000)}`,
      false,
    );
    return { text: text.trim() };
  });

export const improveExperience = createServerFn({ method: "POST" })
  .inputValidator((input: { role: string; company: string; description: string }) =>
    z.object({ role: z.string(), company: z.string(), description: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const text = await chat(
      "Reescreves descrições de experiência profissional para CV em português de Moçambique. Devolve 3 a 4 linhas, uma conquista por linha, começando por verbo de acção, com números quando fizer sentido. Sem marcadores, sem numeração, apenas linhas separadas por quebra de linha.",
      `Cargo: ${data.role}\nEmpresa: ${data.company}\nDescrição actual: ${data.description || "(vazia)"}`,
      false,
    );
    return { text: text.trim() };
  });

export const tailorToJob = createServerFn({ method: "POST" })
  .inputValidator((input: { vacancy: string; context: string }) =>
    z.object({ vacancy: z.string().min(20), context: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const content = await chat(
      `Comparas um CV com uma vaga e devolves APENAS JSON: {"summary":"resumo profissional adaptado à vaga, 45-70 palavras","keywords":["palavra-chave"],"advice":["conselho curto"]}. Escreve em português de Moçambique.`,
      `VAGA:\n${data.vacancy.slice(0, 6000)}\n\nCV:\n${data.context.slice(0, 8000)}`,
      true,
    );
    try {
      return JSON.parse(content) as { summary: string; keywords: string[]; advice: string[] };
    } catch {
      throw new Error("Não foi possível analisar a vaga.");
    }
  });

export const writeCoverLetter = createServerFn({ method: "POST" })
  .inputValidator((input: { context: string; vacancy: string }) =>
    z.object({ context: z.string(), vacancy: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const text = await chat(
      "Escreves cartas de apresentação profissionais em português de Moçambique, com 4 parágrafos curtos, tom cordial e concreto. Devolve apenas o texto da carta.",
      `CV:\n${data.context.slice(0, 8000)}\n\nVaga (opcional):\n${data.vacancy.slice(0, 4000)}`,
      false,
    );
    return { text: text.trim() };
  });
