import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/incorporar")({
  head: () => ({
    meta: [
      { title: "Incorporar o gerador de CV no seu site — Moza Empregos" },
      {
        name: "description",
        content:
          "Copie um código iframe e integre o gerador de currículos no seu site de vagas em minutos.",
      },
      { property: "og:title", content: "Incorporar o gerador de CV no seu site" },
      {
        property: "og:description",
        content: "Integração por iframe, sem login e sem servidor adicional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmbedPage,
});

function EmbedPage() {
  const [origin] = useState(() =>
    typeof window === "undefined" ? "https://o-seu-dominio.lovable.app" : window.location.origin,
  );

  const snippets = [
    {
      title: "Editor completo (recomendado)",
      desc: "Galeria de modelos, importação do CV antigo, edição em tempo real e exportação.",
      code: `<iframe
  src="${origin}/editor?embed=true"
  title="Gerador de CV"
  style="width:100%;height:1100px;border:0;border-radius:12px"
  allow="clipboard-write"
></iframe>`,
    },
    {
      title: "Modelo específico",
      desc: "Abre já num modelo escolhido (substitua o id do modelo).",
      code: `<iframe
  src="${origin}/editor?embed=true&modelo=aurora"
  title="Gerador de CV"
  style="width:100%;height:1100px;border:0;border-radius:12px"
></iframe>`,
    },
    {
      title: "Galeria de modelos",
      desc: "Mostra primeiro os 10 modelos preenchidos para o candidato escolher.",
      code: `<iframe
  src="${origin}/"
  title="Modelos de CV"
  style="width:100%;height:1400px;border:0;border-radius:12px"
></iframe>`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar aos modelos
        </Link>

        <h1 className="mt-6 font-serif text-4xl font-bold">Incorporar no seu site de vagas</h1>
        <p className="mt-3 text-muted-foreground">
          O gerador funciona inteiramente no navegador do candidato — não precisa de login nem de
          base de dados no seu site. Basta colar um dos códigos abaixo na página onde quer o
          gerador.
        </p>

        <div className="mt-8 space-y-6">
          {snippets.map((s) => (
            <section key={s.title} className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
                <code>{s.code}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  void navigator.clipboard.writeText(s.code);
                  toast.success("Código copiado.");
                }}
              >
                <Copy className="size-4" /> Copiar código
              </Button>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Notas de integração</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Os dados do CV ficam guardados apenas no dispositivo do candidato.</li>
            <li>
              • Use <code className="rounded bg-muted px-1">?embed=true</code> para esconder a
              navegação do site e mostrar apenas o editor.
            </li>
            <li>
              • Recomendamos altura mínima de 1100&nbsp;px no iframe para o editor e a
              pré-visualização A4.
            </li>
            <li>• A exportação em PDF e Word acontece no navegador, sem enviar dados para fora.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
