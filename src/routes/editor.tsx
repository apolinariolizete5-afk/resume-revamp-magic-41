import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  LayoutTemplate,
  Loader2,
  Minus,
  PenLine,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVDocument, A4_W } from "@/components/cv/CVDocument";
import { EditorPanel } from "@/components/cv/EditorPanel";
import { useCVState, defaultTheme } from "@/lib/cv/store";
import { exportDOCX, exportPDF } from "@/lib/cv/export";
import { sampleCV } from "@/lib/cv/sample";
import { cn } from "@/lib/utils";

type EditorSearch = { modelo?: string | undefined; embed?: boolean | undefined };
type Tab = "conteudo" | "design" | "preview";

export const Route = createFileRoute("/editor")({
  validateSearch: (search: Record<string, unknown>): EditorSearch => ({
    modelo: typeof search["modelo"] === "string" ? search["modelo"] : undefined,
    embed: search["embed"] === true || search["embed"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Editor de CV em tempo real — Moza Empregos" },
      {
        name: "description",
        content:
          "Edite o seu currículo em tempo real, personalize cores e tipografia e descarregue em PDF ou Word.",
      },
      { property: "og:title", content: "Editor de CV em tempo real — Moza Empregos" },
      {
        property: "og:description",
        content: "Importe o CV antigo, edite ao vivo e exporte em PDF ou Word.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EditorPage,
});

const TABS: { id: Tab; label: string; icon: typeof PenLine }[] = [
  { id: "conteudo", label: "Editar", icon: PenLine },
  { id: "design", label: "Modelo", icon: LayoutTemplate },
  { id: "preview", label: "Pré-ver", icon: Eye },
];

function EditorPage() {
  const { modelo, embed } = Route.useSearch();
  const { state, setState, setData, setTheme, hydrated } = useCVState();
  const [zoom, setZoom] = useState(0.62);
  const [autoFit, setAutoFit] = useState(true);
  const [tab, setTab] = useState<Tab>("conteudo");
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [paperH, setPaperH] = useState(0);
  const applied = useRef(false);

  useEffect(() => {
    if (!hydrated || applied.current) return;
    applied.current = true;
    setState((s) => ({
      data: s.data.name || s.data.summary ? s.data : sampleCV,
      theme: modelo ? { ...defaultTheme(modelo), hidden: s.theme.hidden } : s.theme,
    }));
  }, [hydrated, modelo, setState]);

  // Fit the A4 page to the available width (mobile first).
  useLayoutEffect(() => {
    if (!autoFit) return;
    const fit = () => {
      const w = (stageRef.current?.clientWidth ?? window.innerWidth) - 24;
      const next = Math.min(0.95, Math.max(0.25, +(w / A4_W).toFixed(3)));
      setZoom(next);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [autoFit, tab]);

  // Keep the scaled stage exactly as tall as the rendered document (multi-page safe).
  useEffect(() => {
    const el = paperRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setPaperH(el.scrollHeight));
    ro.observe(el);
    setPaperH(el.scrollHeight);
    return () => ro.disconnect();
  }, [tab, state.theme.templateId]);

  async function handleExport(kind: "pdf" | "docx") {
    setExporting(kind);
    try {
      if (kind === "pdf") {
        if (!paperRef.current) throw new Error("Pré-visualização indisponível.");
        await exportPDF(paperRef.current, state.data);
      } else {
        await exportDOCX(state.data);
      }
      toast.success(kind === "pdf" ? "PDF descarregado." : "Documento Word descarregado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao exportar.");
    } finally {
      setExporting(null);
    }
  }

  const zoomBy = (delta: number) => {
    setAutoFit(false);
    setZoom((z) => Math.min(1.3, Math.max(0.25, +(z + delta).toFixed(2))));
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2">
            {!embed && (
              <Link
                to="/"
                aria-label="Voltar aos modelos"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
              </Link>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm leading-tight font-semibold">Criador de CV</p>
              <p className="truncate text-[11px] text-muted-foreground">
                Guardado automaticamente
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10"
              aria-label="Descarregar Word"
              onClick={() => void handleExport("docx")}
              disabled={exporting !== null}
            >
              {exporting === "docx" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              <span className="hidden sm:inline">Word</span>
            </Button>
            <Button
              size="sm"
              className="h-10"
              aria-label="Descarregar PDF"
              onClick={() => void handleExport("pdf")}
              disabled={exporting !== null}
            >
              {exporting === "pdf" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              PDF
            </Button>
          </div>
        </div>

        {/* Mobile tabs */}
        <nav className="grid grid-cols-3 border-t border-border lg:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={cn(
                "flex min-h-12 items-center justify-center gap-1.5 text-xs font-semibold transition-colors",
                tab === t.id
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-muted-foreground",
              )}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-6 overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div
          className={cn(
            "min-w-0 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2",
            tab === "preview" && "hidden",
          )}
        >
          <EditorPanel
            state={state}
            setState={setState}
            setData={setData}
            setTheme={setTheme}
            tab={tab === "design" ? "design" : "conteudo"}
          />
          <div className="mt-4 lg:hidden">
            <Button className="h-12 w-full" onClick={() => setTab("preview")}>
              <Eye className="size-4" /> Ver pré-visualização
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "min-w-0 lg:sticky lg:top-28 lg:self-start lg:opacity-100 lg:pointer-events-auto lg:static-safe",
            tab !== "preview" &&
              "pointer-events-none fixed top-0 left-[-10000px] w-[380px] opacity-0 lg:relative lg:left-auto lg:w-auto lg:opacity-100 lg:pointer-events-auto",
          )}
        >

          <div className="mb-3 flex items-center justify-between gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-10 lg:invisible"
              onClick={() => setTab("conteudo")}
            >
              <PenLine className="size-4" /> Editar
            </Button>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="size-10"
                aria-label="Reduzir zoom"
                onClick={() => zoomBy(-0.08)}
              >
                <Minus className="size-4" />
              </Button>
              <button
                type="button"
                onClick={() => setAutoFit(true)}
                className="w-14 text-center text-xs font-medium text-muted-foreground"
              >
                {Math.round(zoom * 100)}%
              </button>
              <Button
                size="icon"
                variant="outline"
                className="size-10"
                aria-label="Aumentar zoom"
                onClick={() => zoomBy(0.08)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          <div ref={stageRef} className="overflow-x-auto rounded-xl bg-muted/60 p-2 sm:p-4">
            <div
              style={{
                width: A4_W * zoom,
                height: paperH ? paperH * zoom : undefined,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  width: A4_W,
                }}
                className="paper-shadow"
              >
                <div ref={paperRef}>
                  <CVDocument data={state.data} theme={state.theme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
