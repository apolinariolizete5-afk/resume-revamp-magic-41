import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { TEMPLATES } from "@/components/cv/CVDocument";
import {
  ACCENTS,
  FONT_PAIRS,
  SECTION_LABELS,
  uid,
  type CVData,
  type CVSectionKey,
  type CVState,
  type CVTheme,
} from "@/lib/cv/types";
import { scoreCV, defaultTheme } from "@/lib/cv/store";
import { compressImage, extractTextFromFile, readImageAsDataURL } from "@/lib/cv/import";
import {
  improveExperience,
  parseCVText,
  tailorToJob,
  writeCoverLetter,
  writeSummary,
} from "@/lib/cv/ai.functions";
import { sampleCV } from "@/lib/cv/sample";
import { cn } from "@/lib/utils";

type Props = {
  state: CVState;
  setState: (updater: (s: CVState) => CVState) => void;
  setData: (patch: Partial<CVData> | ((d: CVData) => CVData)) => void;
  setTheme: (patch: Partial<CVTheme>) => void;
};

const contextFromCV = (d: CVData) =>
  [
    `Nome: ${d.name}`,
    `Cargo: ${d.job}`,
    `Resumo: ${d.summary}`,
    ...d.experiences.map((e) => `Experiência: ${e.role} — ${e.company} (${e.period}). ${e.description}`),
    ...d.education.map((e) => `Formação: ${e.course} — ${e.school} (${e.period})`),
    `Competências: ${d.skills.join(", ")}`,
    `Idiomas: ${d.languages.map((l) => `${l.name} (${l.level})`).join(", ")}`,
  ].join("\n");

export function EditorPanel({ state, setState, setData, setTheme }: Props) {
  const { data, theme } = state;
  const cvFileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [vacancy, setVacancy] = useState("");
  const [letter, setLetter] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const parse = useServerFn(parseCVText);
  const summarize = useServerFn(writeSummary);
  const improve = useServerFn(improveExperience);
  const tailor = useServerFn(tailorToJob);
  const cover = useServerFn(writeCoverLetter);

  const quality = scoreCV(data);

  async function handleCVFile(file: File) {
    setImporting(true);
    setProgress(15);
    try {
      const text = await extractTextFromFile(file);
      setProgress(45);
      if (text.length < 40) throw new Error("Não foi possível ler texto neste ficheiro.");
      const parsed = await parse({ data: { text } });
      setProgress(90);
      setData((d) => ({
        ...d,
        name: parsed.name || d.name,
        job: parsed.job || d.job,
        email: parsed.email || d.email,
        phone: parsed.phone || d.phone,
        location: parsed.location || d.location,
        link: parsed.link || d.link,
        summary: parsed.summary || d.summary,
        experiences: parsed.experiences.length
          ? parsed.experiences.map((e) => ({ id: uid(), ...e }))
          : d.experiences,
        education: parsed.education.length
          ? parsed.education.map((e) => ({ id: uid(), ...e }))
          : d.education,
        skills: parsed.skills.length ? parsed.skills : d.skills,
        languages: parsed.languages.length
          ? parsed.languages.map((l) => ({ id: uid(), ...l }))
          : d.languages,
        certificates: parsed.certificates.length
          ? parsed.certificates.map((c) => ({ id: uid(), ...c }))
          : d.certificates,
        interests: parsed.interests.length ? parsed.interests : d.interests,
      }));
      setProgress(100);
      toast.success("CV importado! Reveja os dados antes de descarregar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao importar o CV.");
    } finally {
      setTimeout(() => setProgress(0), 800);
      setImporting(false);
    }
  }

  async function handlePhoto(file: File) {
    try {
      const raw = await readImageAsDataURL(file);
      const compact = await compressImage(raw);
      setData({ photo: compact });
      toast.success("Foto adicionada.");
    } catch {
      toast.error("Não foi possível carregar a imagem.");
    }
  }

  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no pedido de IA.");
    } finally {
      setBusy(null);
    }
  }

  const toggleSection = (k: CVSectionKey, visible: boolean) =>
    setTheme({
      hidden: visible ? theme.hidden.filter((h) => h !== k) : [...new Set([...theme.hidden, k])],
    });

  return (
    <div className="space-y-4 pb-16">
      {/* Import */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Upload className="size-4 text-primary" /> Importar CV antigo
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Carregue o seu CV em PDF, Word (.docx) ou TXT. A IA preenche os campos automaticamente.
          Reveja sempre o resultado.
        </p>
        <input
          ref={cvFileRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleCVFile(f);
            e.target.value = "";
          }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => cvFileRef.current?.click()} disabled={importing}>
            {importing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Carregar ficheiro
          </Button>
          <Button size="sm" variant="outline" onClick={() => setData(() => sampleCV)}>
            Usar exemplo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setState((s) => ({ ...s, data: { ...sampleCV, photo: null, name: "", job: "" } }))
            }
          >
            Limpar
          </Button>
        </div>
        {progress > 0 && <Progress value={progress} className="mt-3 h-1.5" />}
      </section>

      {/* Quality */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Qualidade do CV</h2>
          <span className="text-lg font-bold text-primary">{quality.score}/100</span>
        </div>
        <Progress value={quality.score} className="mt-2 h-1.5" />
        {quality.tips.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {quality.tips.slice(0, 4).map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Design */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-bold">Modelo e estilo</h2>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme({ ...defaultTheme(t.id), density: theme.density, hidden: theme.hidden })}
              title={t.name}
              className={cn(
                "rounded-md border px-1 py-2 text-[10px] font-semibold transition-colors",
                theme.templateId === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
        <Label className="mt-4 block text-xs">Cor de destaque</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              aria-label={`Cor ${c}`}
              onClick={() => setTheme({ accent: c })}
              className={cn(
                "size-7 rounded-full border-2",
                theme.accent === c ? "border-foreground" : "border-transparent",
              )}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={theme.accent}
            onChange={(e) => setTheme({ accent: e.target.value })}
            className="size-7 cursor-pointer rounded-full border border-border bg-transparent p-0"
            aria-label="Cor personalizada"
          />
        </div>
        <Label className="mt-4 block text-xs">Tipografia</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {Object.entries(FONT_PAIRS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setTheme({ fontPair: k })}
              className={cn(
                "rounded-md border px-2 py-1.5 text-xs",
                theme.fontPair === k ? "border-primary bg-primary/10 text-primary" : "border-border",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
        <Label className="mt-4 block text-xs">
          Espaçamento: <span className="font-semibold">{theme.density}</span>
        </Label>
        <Slider
          className="mt-2"
          min={0}
          max={2}
          step={1}
          value={[theme.density === "compacto" ? 0 : theme.density === "normal" ? 1 : 2]}
          onValueChange={([v]) =>
            setTheme({ density: v === 0 ? "compacto" : v === 1 ? "normal" : "espaçoso" })
          }
        />
        <div className="mt-4 space-y-2">
          <Label className="text-xs">Secções visíveis</Label>
          {(Object.keys(SECTION_LABELS) as CVSectionKey[]).map((k) => (
            <div key={k} className="flex items-center justify-between text-xs">
              <span>{SECTION_LABELS[k]}</span>
              <Switch
                checked={!theme.hidden.includes(k)}
                onCheckedChange={(v) => toggleSection(k, v)}
              />
            </div>
          ))}
        </div>
      </section>

      <Accordion type="multiple" defaultValue={["pessoais", "resumo", "experiencia"]}>
        <AccordionItem value="pessoais" className="rounded-xl border border-border bg-card px-4">
          <AccordionTrigger className="text-sm font-bold">
            <span className="flex items-center gap-2">
              <User className="size-4 text-primary" /> Dados pessoais e foto
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex items-center gap-3">
              {data.photo ? (
                <img src={data.photo} alt="" className="size-16 rounded-full object-cover" />
              ) : (
                <div className="grid size-16 place-items-center rounded-full border border-dashed border-border text-[10px] text-muted-foreground">
                  Foto
                </div>
              )}
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handlePhoto(f);
                  e.target.value = "";
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => photoRef.current?.click()}>
                  Anexar foto
                </Button>
                {data.photo && (
                  <Button size="sm" variant="ghost" onClick={() => setData({ photo: null })}>
                    Remover
                  </Button>
                )}
              </div>
            </div>
            <Field label="Nome completo" value={data.name} onChange={(v) => setData({ name: v })} />
            <Field
              label="Profissão / cargo pretendido"
              value={data.job}
              onChange={(v) => setData({ job: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" value={data.email} onChange={(v) => setData({ email: v })} />
              <Field label="Telefone" value={data.phone} onChange={(v) => setData({ phone: v })} />
            </div>
            <Field
              label="Localização"
              value={data.location}
              onChange={(v) => setData({ location: v })}
            />
            <Field
              label="LinkedIn / Portfólio"
              value={data.link}
              onChange={(v) => setData({ link: v })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="resumo" className="mt-3 rounded-xl border border-border bg-card px-4">
          <AccordionTrigger className="text-sm font-bold">Resumo profissional</AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            <Textarea
              rows={5}
              value={data.summary}
              onChange={(e) => setData({ summary: e.target.value })}
              placeholder="Um parágrafo curto sobre a sua experiência e objectivos."
            />
            <Button
              size="sm"
              variant="secondary"
              disabled={busy === "summary"}
              onClick={() =>
                run("summary", async () => {
                  const r = await summarize({
                    data: { job: data.job, context: contextFromCV(data), current: data.summary },
                  });
                  setData({ summary: r.text });
                  toast.success("Resumo gerado.");
                })
              }
            >
              {busy === "summary" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Gerar com IA
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="experiencia"
          className="mt-3 rounded-xl border border-border bg-card px-4"
        >
          <AccordionTrigger className="text-sm font-bold">
            <span className="flex items-center gap-2">
              <Briefcase className="size-4 text-primary" /> Experiência profissional
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {data.experiences.map((e, i) => (
              <div key={e.id} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Experiência {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remover"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          experiences: d.experiences.filter((x) => x.id !== e.id),
                        }))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <Field
                  label="Cargo"
                  value={e.role}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) => (x.id === e.id ? { ...x, role: v } : x)),
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Empresa"
                    value={e.company}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        experiences: d.experiences.map((x) =>
                          x.id === e.id ? { ...x, company: v } : x,
                        ),
                      }))
                    }
                  />
                  <Field
                    label="Período"
                    value={e.period}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        experiences: d.experiences.map((x) =>
                          x.id === e.id ? { ...x, period: v } : x,
                        ),
                      }))
                    }
                  />
                </div>
                <Label className="text-xs">Descrição (uma conquista por linha)</Label>
                <Textarea
                  rows={4}
                  value={e.description}
                  onChange={(ev) =>
                    setData((d) => ({
                      ...d,
                      experiences: d.experiences.map((x) =>
                        x.id === e.id ? { ...x, description: ev.target.value } : x,
                      ),
                    }))
                  }
                />
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy === `exp-${e.id}`}
                  onClick={() =>
                    run(`exp-${e.id}`, async () => {
                      const r = await improve({
                        data: { role: e.role, company: e.company, description: e.description },
                      });
                      setData((d) => ({
                        ...d,
                        experiences: d.experiences.map((x) =>
                          x.id === e.id ? { ...x, description: r.text } : x,
                        ),
                      }));
                      toast.success("Descrição melhorada.");
                    })
                  }
                >
                  {busy === `exp-${e.id}` ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Melhorar com IA
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setData((d) => ({
                  ...d,
                  experiences: [
                    ...d.experiences,
                    { id: uid(), role: "", company: "", period: "", description: "" },
                  ],
                }))
              }
            >
              <Plus className="size-4" /> Adicionar experiência
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formacao" className="mt-3 rounded-xl border border-border bg-card px-4">
          <AccordionTrigger className="text-sm font-bold">
            <span className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" /> Formação académica
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {data.education.map((e, i) => (
              <div key={e.id} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Formação {i + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remover"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        education: d.education.filter((x) => x.id !== e.id),
                      }))
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Field
                  label="Curso"
                  value={e.course}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      education: d.education.map((x) => (x.id === e.id ? { ...x, course: v } : x)),
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Instituição"
                    value={e.school}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        education: d.education.map((x) => (x.id === e.id ? { ...x, school: v } : x)),
                      }))
                    }
                  />
                  <Field
                    label="Período"
                    value={e.period}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        education: d.education.map((x) => (x.id === e.id ? { ...x, period: v } : x)),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setData((d) => ({
                  ...d,
                  education: [
                    ...d.education,
                    { id: uid(), course: "", school: "", period: "", description: "" },
                  ],
                }))
              }
            >
              <Plus className="size-4" /> Adicionar formação
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="mt-3 rounded-xl border border-border bg-card px-4">
          <AccordionTrigger className="text-sm font-bold">
            Competências, idiomas e certificados
          </AccordionTrigger>
          <AccordionContent className="space-y-5 pb-4">
            <div>
              <Label className="text-xs">Competências</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={skillInput}
                  placeholder="Ex.: Excel avançado"
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && skillInput.trim()) {
                      e.preventDefault();
                      setData((d) => ({ ...d, skills: [...d.skills, skillInput.trim()] }));
                      setSkillInput("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!skillInput.trim()) return;
                    setData((d) => ({ ...d, skills: [...d.skills, skillInput.trim()] }));
                    setSkillInput("");
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.skills.map((s, i) => (
                  <button
                    key={`${s}-${i}`}
                    onClick={() =>
                      setData((d) => ({ ...d, skills: d.skills.filter((_, x) => x !== i) }))
                    }
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
                  >
                    {s} ✕
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 text-xs">
                <LanguagesIcon className="size-3.5" /> Idiomas
              </Label>
              <div className="mt-2 space-y-2">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex gap-2">
                    <Input
                      value={l.name}
                      placeholder="Idioma"
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          languages: d.languages.map((x) =>
                            x.id === l.id ? { ...x, name: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Input
                      value={l.level}
                      placeholder="Nível"
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          languages: d.languages.map((x) =>
                            x.id === l.id ? { ...x, level: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remover idioma"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          languages: d.languages.filter((x) => x.id !== l.id),
                        }))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      languages: [...d.languages, { id: uid(), name: "", level: "" }],
                    }))
                  }
                >
                  <Plus className="size-4" /> Adicionar idioma
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs">Certificados</Label>
              <div className="mt-2 space-y-2">
                {data.certificates.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <Input
                      value={c.name}
                      placeholder="Certificado"
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          certificates: d.certificates.map((x) =>
                            x.id === c.id ? { ...x, name: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Input
                      value={c.issuer}
                      placeholder="Entidade"
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          certificates: d.certificates.map((x) =>
                            x.id === c.id ? { ...x, issuer: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Input
                      value={c.year}
                      placeholder="Ano"
                      className="w-20"
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          certificates: d.certificates.map((x) =>
                            x.id === c.id ? { ...x, year: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remover certificado"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          certificates: d.certificates.filter((x) => x.id !== c.id),
                        }))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      certificates: [...d.certificates, { id: uid(), name: "", issuer: "", year: "" }],
                    }))
                  }
                >
                  <Plus className="size-4" /> Adicionar certificado
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs">Interesses</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={interestInput}
                  placeholder="Ex.: Fotografia"
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && interestInput.trim()) {
                      e.preventDefault();
                      setData((d) => ({ ...d, interests: [...d.interests, interestInput.trim()] }));
                      setInterestInput("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!interestInput.trim()) return;
                    setData((d) => ({ ...d, interests: [...d.interests, interestInput.trim()] }));
                    setInterestInput("");
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.interests.map((s, i) => (
                  <button
                    key={`${s}-${i}`}
                    onClick={() =>
                      setData((d) => ({ ...d, interests: d.interests.filter((_, x) => x !== i) }))
                    }
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
                  >
                    {s} ✕
                  </button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vaga" className="mt-3 rounded-xl border border-border bg-card px-4">
          <AccordionTrigger className="text-sm font-bold">
            Adaptar a uma vaga e carta de apresentação
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <Label className="text-xs">Cole aqui a descrição da vaga</Label>
            <Textarea
              rows={5}
              value={vacancy}
              onChange={(e) => setVacancy(e.target.value)}
              placeholder="Requisitos, responsabilidades e perfil pretendido..."
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={busy === "tailor" || vacancy.trim().length < 20}
                onClick={() =>
                  run("tailor", async () => {
                    const r = await tailor({
                      data: { vacancy, context: contextFromCV(data) },
                    });
                    setData({ summary: r.summary });
                    toast.success(
                      `Resumo adaptado. Palavras-chave: ${(r.keywords ?? []).slice(0, 6).join(", ")}`,
                      { duration: 8000 },
                    );
                    if (r.advice?.length) {
                      toast.message("Conselhos", { description: r.advice.join(" · "), duration: 10000 });
                    }
                  })
                }
              >
                {busy === "tailor" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Adaptar CV à vaga
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy === "letter"}
                onClick={() =>
                  run("letter", async () => {
                    const r = await cover({ data: { context: contextFromCV(data), vacancy } });
                    setLetter(r.text);
                    toast.success("Carta gerada.");
                  })
                }
              >
                {busy === "letter" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Gerar carta de apresentação
              </Button>
            </div>
            {letter && (
              <>
                <Textarea rows={10} value={letter} onChange={(e) => setLetter(e.target.value)} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(letter);
                    toast.success("Carta copiada.");
                  }}
                >
                  Copiar carta
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
