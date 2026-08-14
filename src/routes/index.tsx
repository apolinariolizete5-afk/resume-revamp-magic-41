import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Eye, FileText, Sparkles, Upload, Wand2 } from "lucide-react";
import { CVThumb, TEMPLATES, type TemplateMeta } from "@/components/cv/CVDocument";
import { sampleCV, sampleVariants } from "@/lib/cv/sample";
import { defaultTheme, loadState, saveState } from "@/lib/cv/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Criador de CV Premium | Moza Empregos" },
      {
        name: "description",
        content:
          "Crie um currículo profissional em minutos: 10 modelos premium, importação automática do seu CV antigo, edição em tempo real e download em PDF ou Word.",
      },
      { property: "og:title", content: "Criador de CV Premium | Moza Empregos" },
      {
        property: "og:description",
        content:
          "10 modelos premium, preenchimento automático a partir do seu CV antigo e download em PDF ou Word.",
      },
    ],
  }),
  component: Gallery,
});

const CATEGORIES = ["Todos", "Moderno", "Clássico", "Criativo", "Executivo"] as const;

function sampleFor(index: number) {
  const variant = index % 3 === 1 ? sampleVariants["b"] : index % 3 === 2 ? sampleVariants["c"] : {};
  return { ...sampleCV, ...variant };
}

function Gallery() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [preview, setPreview] = useState<{ tpl: TemplateMeta; index: number } | null>(null);

  const list = useMemo(
    () => TEMPLATES.filter((t) => filter === "Todos" || t.category === filter),
    [filter],
  );

  const choose = (tpl: TemplateMeta) => {
    const existing = loadState();
    const theme = { ...defaultTheme(tpl.id), ...(existing ? { density: existing.theme.density } : {}) };
    saveState({ data: existing?.data ?? sampleCV, theme });
    navigate({ to: "/editor", search: { modelo: tpl.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-ink text-ink-foreground">
              <FileText className="size-4" />
            </span>
            <div>
              <p className="font-display text-lg leading-none font-semibold">Moza Empregos</p>
              <p className="text-xs text-muted-foreground">Criador de CV Premium</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/incorporar"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
            >
              Incorporar no seu site
            </Link>
            <Button onClick={() => choose(TEMPLATES[0]!)} size="sm">
              Criar o meu CV
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border/60 bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" /> Preenchimento automático com IA
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl">
              O seu currículo com acabamento profissional, pronto em minutos.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Carregue o CV que já tem em PDF ou Word, anexe a sua foto e o sistema preenche tudo
              automaticamente. Escolha um dos 10 modelos premium, edite em tempo real e descarregue
              em PDF ou Word.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => choose(TEMPLATES[0]!)}>
                Começar agora <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#modelos">Ver os 10 modelos</a>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Importa PDF e Word automaticamente",
                "Foto com recorte profissional",
                "Edição em tempo real",
                "Download em PDF e Word (.docx)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden justify-center lg:flex">
            <div className="rotate-[-4deg] rounded-md bg-card paper-shadow">
              <CVThumb data={sampleCV} theme={defaultTheme("aurora")} width={300} />
            </div>
            <div className="ml-[-70px] mt-14 rotate-[4deg] rounded-md bg-card paper-shadow">
              <CVThumb data={{ ...sampleCV, ...sampleVariants["b"] }} theme={defaultTheme("editorial")} width={300} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14" id="modelos">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold">Escolha o seu modelo</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Todos os modelos aparecem já preenchidos com um exemplo. Clique para ver em grande.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  filter === c
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((tpl, i) => (
            <article key={tpl.id} className="group">
              <div className="overflow-hidden rounded-lg border border-border bg-card paper-shadow transition-transform group-hover:-translate-y-1">
                <div className="pointer-events-none">
                  <CVThumb data={sampleFor(i)} theme={defaultTheme(tpl.id)} width={320} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{tpl.name}</p>
                  <p className="text-xs text-muted-foreground">{tpl.category}</p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Pré-visualizar ${tpl.name}`}
                    onClick={() => setPreview({ tpl, index: i })}
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button size="sm" onClick={() => choose(tpl)}>
                    Usar
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-3">
          {[
            {
              icon: Upload,
              title: "1. Carregue o CV antigo",
              text: "PDF ou Word. A IA lê e preenche todos os campos por si. Também pode começar do zero.",
            },
            {
              icon: Wand2,
              title: "2. Edite em tempo real",
              text: "Mude modelo, cor, tipografia e conteúdo. A pré-visualização actualiza a cada tecla.",
            },
            {
              icon: FileText,
              title: "3. Descarregue",
              text: "PDF fiel ao design para enviar, ou Word editável para ajustar mais tarde.",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6">
              <s.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        Moza Empregos · Criador de CV Premium ·{" "}
        <Link to="/incorporar" className="underline underline-offset-4">
          Incorporar no seu site de vagas
        </Link>
      </footer>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-h-[92vh] max-w-[860px] overflow-auto p-4">
          <DialogTitle className="px-1">{preview?.tpl.name}</DialogTitle>
          {preview && (
            <>
              <div className="mx-auto w-fit overflow-hidden rounded-md border border-border paper-shadow">
                <CVThumb
                  data={sampleFor(preview.index)}
                  theme={defaultTheme(preview.tpl.id)}
                  width={640}
                />
              </div>
              <Button className="mt-3 w-full" onClick={() => choose(preview.tpl)}>
                Usar este modelo
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
