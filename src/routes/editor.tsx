import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Download, FileText, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVDocument, A4_W } from "@/components/cv/CVDocument";
import { EditorPanel } from "@/components/cv/EditorPanel";
import { useCVState, defaultTheme } from "@/lib/cv/store";
import { exportDOCX, exportPDF } from "@/lib/cv/export";
import { sampleCV } from "@/lib/cv/sample";

type EditorSearch = { modelo?: string; embed?: boolean };

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

function EditorPage() {
  const { modelo, embed } = Route.useSearch();
  const { state, setState, setData, setTheme, hydrated } = useCVState();
  const [zoom, setZoom] = useState(0.62);
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const applied = useRef(false);

  useEffect(() => {
    if (!hydrated || applied.current) return;
    applied.current = true;
    setState((s) => ({
      data: s.data.name || s.data.summary ? s.data : sampleCV,
      theme: modelo ? { ...defaultTheme(modelo), hidden: s.theme.hidden } : s.theme,
    }));
  }, [hydrated, modelo, setState]);

  useEffect(() => {
    const fit = () => setZoom(window.innerWidth < 1024 ? 0.42 : 0.62);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

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

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
          {!embed && (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Modelos
            </Link>
          )}
          <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
            Guardado automaticamente neste dispositivo
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExport("docx")}
            disabled={exporting !== null}
          >
            {exporting === "docx" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            Word
          </Button>
          <Button size="sm" onClick={() => void handleExport("pdf")} disabled={exporting !== null}>
            {exporting === "pdf" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            PDF
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
          <EditorPanel state={state} setState={setState} setData={setData} setTheme={setTheme} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-end gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Reduzir zoom"
              onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.08).toFixed(2)))}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-12 text-center text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              size="icon"
              variant="outline"
              aria-label="Aumentar zoom"
              onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2)))}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="overflow-auto rounded-xl bg-muted/60 p-4">
            <div
              style={{
                width: A4_W * zoom,
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
