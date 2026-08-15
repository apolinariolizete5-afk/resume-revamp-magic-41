import type { CSSProperties, ReactNode } from "react";
import { FONT_PAIRS, type CVData, type CVSectionKey, type CVTheme } from "@/lib/cv/types";

export const A4_W = 794;
export const A4_H = 1123;

export type TemplateMeta = {
  id: string;
  name: string;
  category: "Clássico" | "Moderno" | "Criativo" | "Executivo";
  accent: string;
  fontPair: keyof typeof FONT_PAIRS | string;
  photo: "circulo" | "quadrado" | "recorte" | "nenhum";
  layout: "sidebar" | "band" | "minimal" | "timeline" | "split" | "hero" | "grid" | "mono" | "stripe" | "column";
  variant?: string;
  side?: "left" | "right";
};

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "aurora",
    name: "Aurora",
    category: "Moderno",
    accent: "#1769e0",
    fontPair: "moderno",
    photo: "circulo",
    layout: "sidebar",
    variant: "dark",
    side: "left",
  },
  {
    id: "meridiano",
    name: "Meridiano",
    category: "Moderno",
    accent: "#0f766e",
    fontPair: "moderno",
    photo: "quadrado",
    layout: "sidebar",
    variant: "tint",
    side: "right",
  },
  {
    id: "editorial",
    name: "Editorial",
    category: "Executivo",
    accent: "#1f2937",
    fontPair: "editorial",
    photo: "recorte",
    layout: "band",
    variant: "serif",
  },
  {
    id: "monograma",
    name: "Monograma",
    category: "Clássico",
    accent: "#111827",
    fontPair: "classico",
    photo: "circulo",
    layout: "minimal",
  },
  {
    id: "cartao",
    name: "Cartão",
    category: "Criativo",
    accent: "#b45309",
    fontPair: "moderno",
    photo: "circulo",
    layout: "band",
    variant: "block",
  },
  {
    id: "linha",
    name: "Linha do Tempo",
    category: "Moderno",
    accent: "#9333ea",
    fontPair: "tecnico",
    photo: "circulo",
    layout: "timeline",
  },
  {
    id: "executivo",
    name: "Executivo",
    category: "Executivo",
    accent: "#0e7490",
    fontPair: "editorial",
    photo: "quadrado",
    layout: "split",
    variant: "serif",
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "Criativo",
    accent: "#be123c",
    fontPair: "tecnico",
    photo: "recorte",
    layout: "sidebar",
    variant: "gradient",
    side: "left",
  },
  {
    id: "compacto",
    name: "Compacto",
    category: "Clássico",
    accent: "#15803d",
    fontPair: "moderno",
    photo: "nenhum",
    layout: "split",
    variant: "sans",
  },
  {
    id: "horizonte",
    name: "Horizonte",
    category: "Criativo",
    accent: "#4338ca",
    fontPair: "moderno",
    photo: "quadrado",
    layout: "band",
    variant: "wave",
  },
  {
    id: "zambeze",
    name: "Zambeze",
    category: "Executivo",
    accent: "#0b2545",
    fontPair: "editorial",
    photo: "quadrado",
    layout: "hero",
    variant: "solid",
  },
  {
    id: "indico",
    name: "Índico",
    category: "Moderno",
    accent: "#0369a1",
    fontPair: "moderno",
    photo: "circulo",
    layout: "hero",
    variant: "outline",
  },
  {
    id: "bazaruto",
    name: "Bazaruto",
    category: "Criativo",
    accent: "#c2410c",
    fontPair: "moderno",
    photo: "circulo",
    layout: "grid",
    variant: "cards",
  },
  {
    id: "gorongosa",
    name: "Gorongosa",
    category: "Moderno",
    accent: "#166534",
    fontPair: "tecnico",
    photo: "quadrado",
    layout: "grid",
    variant: "lines",
  },
  {
    id: "namuli",
    name: "Namuli",
    category: "Executivo",
    accent: "#1e293b",
    fontPair: "editorial",
    photo: "nenhum",
    layout: "mono",
    variant: "serif",
  },
  {
    id: "ponta",
    name: "Ponta d'Ouro",
    category: "Clássico",
    accent: "#7c2d12",
    fontPair: "classico",
    photo: "circulo",
    layout: "mono",
    variant: "caps",
  },
  {
    id: "inhambane",
    name: "Inhambane",
    category: "Criativo",
    accent: "#0d9488",
    fontPair: "moderno",
    photo: "circulo",
    layout: "stripe",
    variant: "initials",
  },
  {
    id: "quirimbas",
    name: "Quirimbas",
    category: "Criativo",
    accent: "#7e22ce",
    fontPair: "tecnico",
    photo: "recorte",
    layout: "stripe",
    variant: "photo",
  },
  {
    id: "maputo",
    name: "Maputo",
    category: "Moderno",
    accent: "#1d4ed8",
    fontPair: "moderno",
    photo: "quadrado",
    layout: "column",
    variant: "band",
  },
  {
    id: "niassa",
    name: "Niassa",
    category: "Clássico",
    accent: "#334155",
    fontPair: "classico",
    photo: "circulo",
    layout: "column",
    variant: "plain",
  },
];

export const getTemplate = (id: string) =>
  TEMPLATES.find((t) => t.id === id) ?? (TEMPLATES[0] as TemplateMeta);

const INK = "#111827";
const MUTED = "#5b6472";
const LINE = "#e2e8f0";

const densityScale = (d: CVTheme["density"]) =>
  d === "compacto" ? 0.88 : d === "espaçoso" ? 1.12 : 1;

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function Photo({
  src,
  shape,
  size,
  accent,
}: {
  src: string | null;
  shape: TemplateMeta["photo"];
  size: number;
  accent: string;
}) {
  if (shape === "nenhum") return null;
  const radius = shape === "circulo" ? "50%" : shape === "quadrado" ? "10px" : "44% 56% 52% 48%";
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    objectFit: "cover",
    background: "#dfe6ee",
    display: "block",
    flexShrink: 0,
  };
  if (!src) {
    return (
      <div
        style={{
          ...style,
          border: `2px dashed ${accent}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: MUTED,
          fontSize: 10,
          textAlign: "center",
          padding: 8,
        }}
      >
        Foto
      </div>
    );
  }
  return <img src={src} alt="" style={style} />;
}

function Title({
  children,
  accent,
  style,
  underline,
}: {
  children: ReactNode;
  accent: string;
  style?: CSSProperties;
  underline?: boolean;
}) {
  return (
    <h2
      style={{
        fontSize: 10.5,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 800,
        color: accent,
        margin: "0 0 8px",
        paddingBottom: underline ? 5 : 0,
        borderBottom: underline ? `1.5px solid ${accent}33` : "none",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

type Ctx = {
  d: CVData;
  t: CVTheme;
  tpl: TemplateMeta;
  accent: string;
  gap: number;
  show: (k: CVSectionKey) => boolean;
  fonts: { heading: string; body: string };
};

function ExperienceList({ ctx, compact }: { ctx: Ctx; compact?: boolean }) {
  return (
    <div style={{ display: "grid", gap: ctx.gap * 0.75 }}>
      {ctx.d.experiences.map((e) => (
        <div key={e.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "baseline",
            }}
          >
            <strong style={{ fontSize: 12.5, color: INK }}>{e.role}</strong>
            <span style={{ fontSize: 9.5, color: MUTED, whiteSpace: "nowrap" }}>{e.period}</span>
          </div>
          <div style={{ fontSize: 11, color: ctx.accent, fontWeight: 600, marginTop: 1 }}>
            {e.company}
          </div>
          {!compact && lines(e.description).length > 0 && (
            <ul style={{ margin: "5px 0 0", paddingLeft: 14, color: MUTED }}>
              {lines(e.description).map((l, i) => (
                <li key={i} style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 2 }}>
                  {l}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationList({ ctx }: { ctx: Ctx }) {
  return (
    <div style={{ display: "grid", gap: ctx.gap * 0.6 }}>
      {ctx.d.education.map((e) => (
        <div key={e.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "baseline",
            }}
          >
            <strong style={{ fontSize: 12, color: INK }}>{e.course}</strong>
            <span style={{ fontSize: 9.5, color: MUTED, whiteSpace: "nowrap" }}>{e.period}</span>
          </div>
          <div style={{ fontSize: 10.5, color: MUTED }}>{e.school}</div>
          {e.description && (
            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{e.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function Pills({ items, accent, onDark }: { items: string[]; accent: string; onDark?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {items.map((s, i) => (
        <span
          key={i}
          style={{
            fontSize: 9.5,
            padding: "3px 8px",
            borderRadius: 999,
            background: onDark ? "rgba(255,255,255,.14)" : `${accent}14`,
            color: onDark ? "#fff" : accent,
            fontWeight: 600,
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function Bars({ items, accent, onDark }: { items: string[]; accent: string; onDark?: boolean }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {items.map((s, i) => (
        <div key={i}>
          <div style={{ fontSize: 10, marginBottom: 3, color: onDark ? "#e6edf6" : INK }}>{s}</div>
          <div
            style={{
              height: 4,
              borderRadius: 4,
              background: onDark ? "rgba(255,255,255,.18)" : `${accent}22`,
            }}
          >
            <div
              style={{
                width: `${88 - (i % 4) * 9}%`,
                height: "100%",
                borderRadius: 4,
                background: onDark ? "#fff" : accent,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LanguagesList({ ctx, onDark }: { ctx: Ctx; onDark?: boolean }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      {ctx.d.languages.map((l) => (
        <div
          key={l.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10.5,
            color: onDark ? "#e6edf6" : INK,
          }}
        >
          <span>{l.name}</span>
          <span style={{ color: onDark ? "rgba(255,255,255,.7)" : MUTED }}>{l.level}</span>
        </div>
      ))}
    </div>
  );
}

function CertificatesList({ ctx, onDark }: { ctx: Ctx; onDark?: boolean }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      {ctx.d.certificates.map((c) => (
        <div key={c.id} style={{ fontSize: 10.5, color: onDark ? "#e6edf6" : INK }}>
          <strong style={{ fontWeight: 600 }}>{c.name}</strong>
          <div style={{ fontSize: 9.5, color: onDark ? "rgba(255,255,255,.7)" : MUTED }}>
            {[c.issuer, c.year].filter(Boolean).join(" · ")}
          </div>
        </div>
      ))}
    </div>
  );
}

function Contacts({ ctx, onDark }: { ctx: Ctx; onDark?: boolean }) {
  const items = [ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean);
  return (
    <div style={{ display: "grid", gap: 3 }}>
      {items.map((c, i) => (
        <div
          key={i}
          style={{
            fontSize: 10,
            color: onDark ? "#e6edf6" : MUTED,
            wordBreak: "break-word",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

/* ---------------- layouts ---------------- */

function SidebarLayout({ ctx }: { ctx: Ctx }) {
  const dark = ctx.tpl.variant !== "tint";
  const bg =
    ctx.tpl.variant === "gradient"
      ? `linear-gradient(160deg, ${ctx.accent}, ${shade(ctx.accent, -45)})`
      : ctx.tpl.variant === "dark"
        ? shade(ctx.accent, -62)
        : `${ctx.accent}10`;
  const sideColor = dark ? "#fff" : INK;
  const side = (
    <aside
      style={{
        background: bg,
        color: sideColor,
        padding: "34px 24px",
        display: "grid",
        gap: ctx.gap,
        alignContent: "start",
      }}
    >
      <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={112} accent={ctx.accent} />
      </div>
      <div>
        <Title accent={dark ? "#fff" : ctx.accent}>Contactos</Title>
        <Contacts ctx={ctx} onDark={dark} />
      </div>
      {ctx.show("skills") && ctx.d.skills.length > 0 && (
        <div>
          <Title accent={dark ? "#fff" : ctx.accent}>Competências</Title>
          <Bars items={ctx.d.skills} accent={ctx.accent} onDark={dark} />
        </div>
      )}
      {ctx.show("languages") && ctx.d.languages.length > 0 && (
        <div>
          <Title accent={dark ? "#fff" : ctx.accent}>Idiomas</Title>
          <LanguagesList ctx={ctx} onDark={dark} />
        </div>
      )}
      {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
        <div>
          <Title accent={dark ? "#fff" : ctx.accent}>Certificados</Title>
          <CertificatesList ctx={ctx} onDark={dark} />
        </div>
      )}
      {ctx.show("interests") && ctx.d.interests.length > 0 && (
        <div>
          <Title accent={dark ? "#fff" : ctx.accent}>Interesses</Title>
          <div style={{ fontSize: 10, lineHeight: 1.6, color: dark ? "#e6edf6" : MUTED }}>
            {ctx.d.interests.join(" · ")}
          </div>
        </div>
      )}
    </aside>
  );

  const main = (
    <main style={{ padding: "38px 32px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
      <header>
        <h1
          style={{
            fontFamily: ctx.fonts.heading,
            fontSize: 30,
            lineHeight: 1.1,
            margin: 0,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        >
          {ctx.d.name || "O seu nome"}
        </h1>
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            fontWeight: 600,
            color: ctx.accent,
            letterSpacing: "0.02em",
          }}
        >
          {ctx.d.job}
        </div>
        <div style={{ height: 3, width: 64, background: ctx.accent, marginTop: 12 }} />
      </header>
      {ctx.show("summary") && ctx.d.summary && (
        <section>
          <Title accent={ctx.accent} underline>
            Perfil
          </Title>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: MUTED }}>{ctx.d.summary}</p>
        </section>
      )}
      {ctx.show("experience") && ctx.d.experiences.length > 0 && (
        <section>
          <Title accent={ctx.accent} underline>
            Experiência profissional
          </Title>
          <ExperienceList ctx={ctx} />
        </section>
      )}
      {ctx.show("education") && ctx.d.education.length > 0 && (
        <section>
          <Title accent={ctx.accent} underline>
            Formação académica
          </Title>
          <EducationList ctx={ctx} />
        </section>
      )}
    </main>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: ctx.tpl.side === "right" ? "1fr 34%" : "34% 1fr",
        minHeight: "100%",
      }}
    >
      {ctx.tpl.side === "right" ? (
        <>
          {main}
          {side}
        </>
      ) : (
        <>
          {side}
          {main}
        </>
      )}
    </div>
  );
}

function BandLayout({ ctx }: { ctx: Ctx }) {
  const v = ctx.tpl.variant;
  const solid = v === "block" || v === "wave";
  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", minHeight: "100%" }}>
      <header
        style={{
          background: solid
            ? v === "wave"
              ? `linear-gradient(115deg, ${ctx.accent}, ${shade(ctx.accent, -35)})`
              : ctx.accent
            : "#fff",
          color: solid ? "#fff" : INK,
          padding: v === "serif" ? "42px 44px 24px" : "34px 40px",
          borderBottom: solid ? "none" : `3px solid ${ctx.accent}`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          borderBottomRightRadius: v === "wave" ? 90 : 0,
        }}
      >
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={96} accent={ctx.accent} />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: v === "serif" ? 36 : 31,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: v === "serif" ? "0" : "-0.02em",
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div
            style={{
              marginTop: 7,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: solid ? "rgba(255,255,255,.9)" : ctx.accent,
            }}
          >
            {ctx.d.job}
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 16px",
              fontSize: 10,
              color: solid ? "rgba(255,255,255,.88)" : MUTED,
            }}
          >
            {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 33%",
          gap: 28,
          padding: "26px 40px 38px",
        }}
      >
        <div style={{ display: "grid", gap: ctx.gap, alignContent: "start" }}>
          {ctx.show("summary") && ctx.d.summary && (
            <section>
              <Title accent={ctx.accent} underline>
                Perfil
              </Title>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: MUTED }}>
                {ctx.d.summary}
              </p>
            </section>
          )}
          {ctx.show("experience") && ctx.d.experiences.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Experiência
              </Title>
              <ExperienceList ctx={ctx} />
            </section>
          )}
          {ctx.show("education") && ctx.d.education.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Formação
              </Title>
              <EducationList ctx={ctx} />
            </section>
          )}
        </div>
        <aside style={{ display: "grid", gap: ctx.gap, alignContent: "start" }}>
          {ctx.show("skills") && ctx.d.skills.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Competências</Title>
              <Pills items={ctx.d.skills} accent={ctx.accent} />
            </section>
          )}
          {ctx.show("languages") && ctx.d.languages.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Idiomas</Title>
              <LanguagesList ctx={ctx} />
            </section>
          )}
          {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Certificados</Title>
              <CertificatesList ctx={ctx} />
            </section>
          )}
          {ctx.show("interests") && ctx.d.interests.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Interesses</Title>
              <div style={{ fontSize: 10, lineHeight: 1.6, color: MUTED }}>
                {ctx.d.interests.join(" · ")}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function MinimalLayout({ ctx }: { ctx: Ctx }) {
  return (
    <div style={{ padding: "52px 56px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
      <header style={{ textAlign: "center", display: "grid", justifyItems: "center", gap: 12 }}>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={92} accent={ctx.accent} />
        <h1
          style={{
            fontFamily: ctx.fonts.heading,
            fontSize: 32,
            margin: 0,
            letterSpacing: "0.04em",
            color: INK,
          }}
        >
          {ctx.d.name || "O seu nome"}
        </h1>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: ctx.accent,
            fontWeight: 600,
          }}
        >
          {ctx.d.job}
        </div>
        <div
          style={{
            borderTop: `1px solid ${LINE}`,
            borderBottom: `1px solid ${LINE}`,
            padding: "7px 0",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "3px 18px",
            fontSize: 10,
            color: MUTED,
          }}
        >
          {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      </header>
      {ctx.show("summary") && ctx.d.summary && (
        <p
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.7,
            color: MUTED,
            textAlign: "center",
            maxWidth: 560,
            justifySelf: "center",
          }}
        >
          {ctx.d.summary}
        </p>
      )}
      {ctx.show("experience") && ctx.d.experiences.length > 0 && (
        <section>
          <Title accent={INK} style={{ textAlign: "center", letterSpacing: "0.3em" }}>
            Experiência
          </Title>
          <ExperienceList ctx={ctx} />
        </section>
      )}
      {ctx.show("education") && ctx.d.education.length > 0 && (
        <section>
          <Title accent={INK} style={{ textAlign: "center", letterSpacing: "0.3em" }}>
            Formação
          </Title>
          <EducationList ctx={ctx} />
        </section>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {ctx.show("skills") && ctx.d.skills.length > 0 && (
          <section>
            <Title accent={INK}>Competências</Title>
            <Pills items={ctx.d.skills} accent={ctx.accent} />
          </section>
        )}
        <div style={{ display: "grid", gap: ctx.gap * 0.7, alignContent: "start" }}>
          {ctx.show("languages") && ctx.d.languages.length > 0 && (
            <section>
              <Title accent={INK}>Idiomas</Title>
              <LanguagesList ctx={ctx} />
            </section>
          )}
          {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
            <section>
              <Title accent={INK}>Certificados</Title>
              <CertificatesList ctx={ctx} />
            </section>
          )}
          {ctx.show("interests") && ctx.d.interests.length > 0 && (
            <section>
              <Title accent={INK}>Interesses</Title>
              <div style={{ fontSize: 10, lineHeight: 1.6, color: MUTED }}>
                {ctx.d.interests.join(" · ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineLayout({ ctx }: { ctx: Ctx }) {
  return (
    <div style={{ padding: "36px 40px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
      <header style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={88} accent={ctx.accent} />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: 29,
              margin: 0,
              color: INK,
              letterSpacing: "-0.01em",
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div style={{ fontSize: 12.5, color: ctx.accent, fontWeight: 700, marginTop: 4 }}>
            {ctx.d.job}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Contacts ctx={ctx} />
        </div>
      </header>
      {ctx.show("summary") && ctx.d.summary && (
        <p
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.65,
            color: MUTED,
            background: `${ctx.accent}0d`,
            borderLeft: `3px solid ${ctx.accent}`,
            padding: "12px 14px",
            borderRadius: "0 8px 8px 0",
          }}
        >
          {ctx.d.summary}
        </p>
      )}
      {ctx.show("experience") && ctx.d.experiences.length > 0 && (
        <section>
          <Title accent={ctx.accent} underline>
            Percurso profissional
          </Title>
          <div style={{ position: "relative", paddingLeft: 20 }}>
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 6,
                bottom: 6,
                width: 2,
                background: `${ctx.accent}33`,
              }}
            />
            <div style={{ display: "grid", gap: ctx.gap * 0.8 }}>
              {ctx.d.experiences.map((e) => (
                <div key={e.id} style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: -20,
                      top: 4,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: ctx.accent,
                      boxShadow: `0 0 0 3px ${ctx.accent}22`,
                    }}
                  />
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
                  >
                    <strong style={{ fontSize: 12.5, color: INK }}>{e.role}</strong>
                    <span style={{ fontSize: 9.5, color: MUTED }}>{e.period}</span>
                  </div>
                  <div style={{ fontSize: 11, color: ctx.accent, fontWeight: 600 }}>{e.company}</div>
                  <ul style={{ margin: "5px 0 0", paddingLeft: 14, color: MUTED }}>
                    {lines(e.description).map((l, i) => (
                      <li key={i} style={{ fontSize: 10.5, lineHeight: 1.5 }}>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {ctx.show("education") && ctx.d.education.length > 0 && (
          <section>
            <Title accent={ctx.accent} underline>
              Formação
            </Title>
            <EducationList ctx={ctx} />
          </section>
        )}
        <div style={{ display: "grid", gap: ctx.gap * 0.7, alignContent: "start" }}>
          {ctx.show("skills") && ctx.d.skills.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Competências
              </Title>
              <Pills items={ctx.d.skills} accent={ctx.accent} />
            </section>
          )}
          {ctx.show("languages") && ctx.d.languages.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Idiomas
              </Title>
              <LanguagesList ctx={ctx} />
            </section>
          )}
          {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Certificados
              </Title>
              <CertificatesList ctx={ctx} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function SplitLayout({ ctx }: { ctx: Ctx }) {
  const serif = ctx.tpl.variant === "serif";
  return (
    <div style={{ padding: "40px 44px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
      <header
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          borderBottom: `2px solid ${ctx.accent}`,
          paddingBottom: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: serif ? 34 : 28,
              margin: 0,
              color: INK,
              letterSpacing: serif ? 0 : "-0.02em",
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div style={{ fontSize: 12.5, color: ctx.accent, fontWeight: 700, marginTop: 5 }}>
            {ctx.d.job}
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: "3px 14px",
              fontSize: 10,
              color: MUTED,
            }}
          >
            {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={86} accent={ctx.accent} />
      </header>
      {ctx.show("summary") && ctx.d.summary && (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: MUTED }}>{ctx.d.summary}</p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        <div style={{ display: "grid", gap: ctx.gap * 0.8, alignContent: "start" }}>
          {ctx.show("experience") && ctx.d.experiences.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Experiência
              </Title>
              <ExperienceList ctx={ctx} />
            </section>
          )}
        </div>
        <div style={{ display: "grid", gap: ctx.gap * 0.8, alignContent: "start" }}>
          {ctx.show("education") && ctx.d.education.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Formação
              </Title>
              <EducationList ctx={ctx} />
            </section>
          )}
          {ctx.show("skills") && ctx.d.skills.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Competências
              </Title>
              <Pills items={ctx.d.skills} accent={ctx.accent} />
            </section>
          )}
          {ctx.show("languages") && ctx.d.languages.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Idiomas
              </Title>
              <LanguagesList ctx={ctx} />
            </section>
          )}
          {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Certificados
              </Title>
              <CertificatesList ctx={ctx} />
            </section>
          )}
          {ctx.show("interests") && ctx.d.interests.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Interesses
              </Title>
              <div style={{ fontSize: 10, lineHeight: 1.6, color: MUTED }}>
                {ctx.d.interests.join(" · ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function shade(hex: string, amount: number) {
  const h = hex.replace("#", "");
  const num = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((num >> 16) & 255) + amount);
  const g = clamp(((num >> 8) & 255) + amount);
  const b = clamp((num & 255) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

/* ---------------- secções extra (cursos, referências, personalizadas) ---------------- */

function CoursesList({ ctx }: { ctx: Ctx }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      {ctx.d.courses.map((c) => (
        <div key={c.id} style={{ fontSize: 10.5, color: INK }}>
          <strong style={{ fontWeight: 600 }}>{c.name}</strong>
          <div style={{ fontSize: 9.5, color: MUTED }}>
            {[c.provider, c.year].filter(Boolean).join(" · ")}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReferencesList({ ctx }: { ctx: Ctx }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {ctx.d.references.map((r) => (
        <div key={r.id} style={{ fontSize: 10.5, color: INK }}>
          <strong style={{ fontWeight: 600 }}>{r.name}</strong>
          <div style={{ fontSize: 9.5, color: MUTED }}>{r.role}</div>
          <div style={{ fontSize: 9.5, color: ctx.accent }}>{r.contact}</div>
        </div>
      ))}
    </div>
  );
}

function Extras({ ctx, inset = true }: { ctx: Ctx; inset?: boolean }) {
  const showCourses = ctx.show("courses") && ctx.d.courses.length > 0;
  const showRefs = ctx.show("references") && ctx.d.references.length > 0;
  const custom = ctx.show("custom")
    ? ctx.d.customSections.filter((c) => c.title.trim() || c.content.trim())
    : [];
  if (!showCourses && !showRefs && custom.length === 0) return null;
  return (
    <div
      style={{
        padding: inset ? "0 40px 36px" : 0,
        display: "grid",
        gap: ctx.gap * 0.8,
        alignContent: "start",
      }}
    >
      {showCourses && (
        <section>
          <Title accent={ctx.accent} underline>
            Cursos e formações
          </Title>
          <CoursesList ctx={ctx} />
        </section>
      )}
      {custom.map((c) => (
        <section key={c.id}>
          <Title accent={ctx.accent} underline>
            {c.title || "Secção"}
          </Title>
          <ul style={{ margin: 0, paddingLeft: 14, color: MUTED }}>
            {lines(c.content).map((l, i) => (
              <li key={i} style={{ fontSize: 10.5, lineHeight: 1.55 }}>
                {l}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {showRefs && (
        <section>
          <Title accent={ctx.accent} underline>
            Referências
          </Title>
          <ReferencesList ctx={ctx} />
        </section>
      )}
    </div>
  );
}

/* ---------------- novos layouts premium ---------------- */

function SideStack({ ctx, onDark }: { ctx: Ctx; onDark?: boolean }) {
  return (
    <>
      {ctx.show("skills") && ctx.d.skills.length > 0 && (
        <section>
          <Title accent={onDark ? "#fff" : ctx.accent}>Competências</Title>
          <Pills items={ctx.d.skills} accent={ctx.accent} onDark={onDark} />
        </section>
      )}
      {ctx.show("languages") && ctx.d.languages.length > 0 && (
        <section>
          <Title accent={onDark ? "#fff" : ctx.accent}>Idiomas</Title>
          <LanguagesList ctx={ctx} onDark={onDark} />
        </section>
      )}
      {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
        <section>
          <Title accent={onDark ? "#fff" : ctx.accent}>Certificados</Title>
          <CertificatesList ctx={ctx} onDark={onDark} />
        </section>
      )}
      {ctx.show("interests") && ctx.d.interests.length > 0 && (
        <section>
          <Title accent={onDark ? "#fff" : ctx.accent}>Interesses</Title>
          <div style={{ fontSize: 10, lineHeight: 1.6, color: onDark ? "#e6edf6" : MUTED }}>
            {ctx.d.interests.join(" · ")}
          </div>
        </section>
      )}
    </>
  );
}

function HeroLayout({ ctx }: { ctx: Ctx }) {
  const solid = ctx.tpl.variant === "solid";
  return (
    <div style={{ display: "grid", alignContent: "start" }}>
      <header
        style={{
          background: solid ? ctx.accent : "#fff",
          color: solid ? "#fff" : INK,
          borderBottom: solid ? "none" : `6px solid ${ctx.accent}`,
          padding: "40px 44px 34px",
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: 44,
              lineHeight: 1.02,
              margin: 0,
              letterSpacing: "-0.03em",
              color: solid ? "#fff" : INK,
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div
            style={{
              marginTop: 10,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: solid ? "rgba(255,255,255,.85)" : ctx.accent,
            }}
          >
            {ctx.d.job}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 18px",
              fontSize: 10.5,
              color: solid ? "rgba(255,255,255,.85)" : MUTED,
            }}
          >
            {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={116} accent={ctx.accent} />
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.55fr 1fr",
          gap: 32,
          padding: "30px 44px 0",
        }}
      >
        <div style={{ display: "grid", gap: ctx.gap, alignContent: "start" }}>
          {ctx.show("summary") && ctx.d.summary && (
            <section>
              <Title accent={ctx.accent} underline>
                Perfil profissional
              </Title>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.7, color: MUTED }}>
                {ctx.d.summary}
              </p>
            </section>
          )}
          {ctx.show("experience") && ctx.d.experiences.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Experiência
              </Title>
              <ExperienceList ctx={ctx} />
            </section>
          )}
          {ctx.show("education") && ctx.d.education.length > 0 && (
            <section>
              <Title accent={ctx.accent} underline>
                Formação
              </Title>
              <EducationList ctx={ctx} />
            </section>
          )}
        </div>
        <div style={{ display: "grid", gap: ctx.gap * 0.9, alignContent: "start" }}>
          <SideStack ctx={ctx} />
        </div>
      </div>
    </div>
  );
}

function GridLayout({ ctx }: { ctx: Ctx }) {
  const cards = ctx.tpl.variant === "cards";
  const box = (children: ReactNode, key?: string) => (
    <section
      key={key}
      style={
        cards
          ? {
              background: `${ctx.accent}0a`,
              border: `1px solid ${ctx.accent}22`,
              borderRadius: 12,
              padding: "14px 16px",
            }
          : { borderTop: `2px solid ${ctx.accent}`, paddingTop: 10 }
      }
    >
      {children}
    </section>
  );
  return (
    <div style={{ padding: "38px 40px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
      <header style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={94} accent={ctx.accent} />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: 38,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: ctx.accent }}>
            {ctx.d.job}
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: "3px 14px",
              fontSize: 10,
              color: MUTED,
            }}
          >
            {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
      </header>
      {ctx.show("summary") &&
        ctx.d.summary &&
        box(
          <>
            <Title accent={ctx.accent}>Perfil</Title>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: MUTED }}>
              {ctx.d.summary}
            </p>
          </>,
        )}
      {ctx.show("experience") &&
        ctx.d.experiences.length > 0 &&
        box(
          <>
            <Title accent={ctx.accent}>Experiência profissional</Title>
            <ExperienceList ctx={ctx} />
          </>,
        )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {ctx.show("education") &&
          ctx.d.education.length > 0 &&
          box(
            <>
              <Title accent={ctx.accent}>Formação</Title>
              <EducationList ctx={ctx} />
            </>,
            "edu",
          )}
        {ctx.show("skills") &&
          ctx.d.skills.length > 0 &&
          box(
            <>
              <Title accent={ctx.accent}>Competências</Title>
              <Pills items={ctx.d.skills} accent={ctx.accent} />
            </>,
            "sk",
          )}
        {ctx.show("languages") &&
          ctx.d.languages.length > 0 &&
          box(
            <>
              <Title accent={ctx.accent}>Idiomas</Title>
              <LanguagesList ctx={ctx} />
            </>,
            "lg",
          )}
        {ctx.show("certificates") &&
          ctx.d.certificates.length > 0 &&
          box(
            <>
              <Title accent={ctx.accent}>Certificados</Title>
              <CertificatesList ctx={ctx} />
            </>,
            "ct",
          )}
      </div>
      {ctx.show("interests") && ctx.d.interests.length > 0 && (
        <div style={{ fontSize: 10, color: MUTED }}>
          <strong style={{ color: ctx.accent }}>Interesses: </strong>
          {ctx.d.interests.join(" · ")}
        </div>
      )}
    </div>
  );
}

function MonoLayout({ ctx }: { ctx: Ctx }) {
  const caps = ctx.tpl.variant === "caps";
  return (
    <div style={{ padding: "54px 60px 40px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
      <header style={{ display: "flex", gap: 22, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: caps ? 38 : 50,
              lineHeight: 1,
              margin: 0,
              color: INK,
              letterSpacing: caps ? "0.08em" : "-0.02em",
              textTransform: caps ? "uppercase" : "none",
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div
            style={{
              marginTop: 12,
              fontSize: 12.5,
              color: MUTED,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {ctx.d.job}
          </div>
        </div>
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={90} accent={ctx.accent} />
      </header>
      <div style={{ height: 2, background: ctx.accent }} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 20px",
          fontSize: 10.5,
          color: MUTED,
        }}
      >
        {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      {ctx.show("summary") && ctx.d.summary && (
        <p
          style={{
            margin: 0,
            fontFamily: ctx.fonts.heading,
            fontSize: 13,
            lineHeight: 1.7,
            color: INK,
          }}
        >
          {ctx.d.summary}
        </p>
      )}
      {ctx.show("experience") && ctx.d.experiences.length > 0 && (
        <section>
          <Title accent={ctx.accent}>Experiência</Title>
          <ExperienceList ctx={ctx} />
        </section>
      )}
      {ctx.show("education") && ctx.d.education.length > 0 && (
        <section>
          <Title accent={ctx.accent}>Formação</Title>
          <EducationList ctx={ctx} />
        </section>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        <div style={{ display: "grid", gap: ctx.gap * 0.7, alignContent: "start" }}>
          {ctx.show("skills") && ctx.d.skills.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Competências</Title>
              <div style={{ fontSize: 10.5, lineHeight: 1.7, color: MUTED }}>
                {ctx.d.skills.join(" · ")}
              </div>
            </section>
          )}
          {ctx.show("interests") && ctx.d.interests.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Interesses</Title>
              <div style={{ fontSize: 10.5, lineHeight: 1.7, color: MUTED }}>
                {ctx.d.interests.join(" · ")}
              </div>
            </section>
          )}
        </div>
        <div style={{ display: "grid", gap: ctx.gap * 0.7, alignContent: "start" }}>
          {ctx.show("languages") && ctx.d.languages.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Idiomas</Title>
              <LanguagesList ctx={ctx} />
            </section>
          )}
          {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Certificados</Title>
              <CertificatesList ctx={ctx} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function StripeLayout({ ctx }: { ctx: Ctx }) {
  const initials = (ctx.d.name || "CV")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const showInitials = ctx.tpl.variant === "initials";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "18px 1fr", alignContent: "start" }}>
      <div style={{ background: `linear-gradient(180deg, ${ctx.accent}, ${shade(ctx.accent, -50)})` }} />
      <div style={{ padding: "40px 42px", display: "grid", gap: ctx.gap, alignContent: "start" }}>
        <header style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {showInitials ? (
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 18,
                background: `${ctx.accent}14`,
                color: ctx.accent,
                display: "grid",
                placeItems: "center",
                fontFamily: ctx.fonts.heading,
                fontSize: 34,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          ) : (
            <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={100} accent={ctx.accent} />
          )}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: ctx.fonts.heading,
                fontSize: 40,
                margin: 0,
                lineHeight: 1.03,
                letterSpacing: "-0.03em",
                color: INK,
              }}
            >
              {ctx.d.name || "O seu nome"}
            </h1>
            <div style={{ marginTop: 7, fontSize: 13, fontWeight: 700, color: ctx.accent }}>
              {ctx.d.job}
            </div>
            <div
              style={{
                marginTop: 9,
                display: "flex",
                flexWrap: "wrap",
                gap: "3px 14px",
                fontSize: 10,
                color: MUTED,
              }}
            >
              {[ctx.d.phone, ctx.d.email, ctx.d.location, ctx.d.link].filter(Boolean).map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          </div>
        </header>
        {ctx.show("summary") && ctx.d.summary && (
          <p
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.7,
              color: MUTED,
              background: `${ctx.accent}0a`,
              padding: "12px 14px",
              borderRadius: 10,
            }}
          >
            {ctx.d.summary}
          </p>
        )}
        {ctx.show("experience") && ctx.d.experiences.length > 0 && (
          <section>
            <Title accent={ctx.accent} underline>
              Experiência profissional
            </Title>
            <ExperienceList ctx={ctx} />
          </section>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 26 }}>
          <div style={{ display: "grid", gap: ctx.gap * 0.7, alignContent: "start" }}>
            {ctx.show("education") && ctx.d.education.length > 0 && (
              <section>
                <Title accent={ctx.accent} underline>
                  Formação
                </Title>
                <EducationList ctx={ctx} />
              </section>
            )}
          </div>
          <div style={{ display: "grid", gap: ctx.gap * 0.7, alignContent: "start" }}>
            <SideStack ctx={ctx} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnLayout({ ctx }: { ctx: Ctx }) {
  const band = ctx.tpl.variant === "band";
  return (
    <div style={{ display: "grid", alignContent: "start" }}>
      <header
        style={{
          padding: "34px 44px",
          background: band ? `${ctx.accent}0f` : "#fff",
          borderBottom: `1px solid ${band ? `${ctx.accent}33` : LINE}`,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <Photo src={ctx.d.photo} shape={ctx.tpl.photo} size={96} accent={ctx.accent} />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: ctx.fonts.heading,
              fontSize: 36,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            {ctx.d.name || "O seu nome"}
          </h1>
          <div
            style={{
              marginTop: 7,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ctx.accent,
            }}
          >
            {ctx.d.job}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Contacts ctx={ctx} />
        </div>
      </header>
      <div style={{ padding: "26px 44px 0", display: "grid", gap: ctx.gap, alignContent: "start" }}>
        {ctx.show("summary") && ctx.d.summary && (
          <section>
            <Title accent={ctx.accent} underline>
              Perfil
            </Title>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.7, color: MUTED }}>{ctx.d.summary}</p>
          </section>
        )}
        {ctx.show("experience") && ctx.d.experiences.length > 0 && (
          <section>
            <Title accent={ctx.accent} underline>
              Experiência profissional
            </Title>
            <ExperienceList ctx={ctx} />
          </section>
        )}
        {ctx.show("education") && ctx.d.education.length > 0 && (
          <section>
            <Title accent={ctx.accent} underline>
              Formação académica
            </Title>
            <EducationList ctx={ctx} />
          </section>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {ctx.show("skills") && ctx.d.skills.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Competências</Title>
              <div style={{ fontSize: 10, lineHeight: 1.7, color: MUTED }}>
                {ctx.d.skills.join(" · ")}
              </div>
            </section>
          )}
          {ctx.show("languages") && ctx.d.languages.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Idiomas</Title>
              <LanguagesList ctx={ctx} />
            </section>
          )}
          {ctx.show("certificates") && ctx.d.certificates.length > 0 && (
            <section>
              <Title accent={ctx.accent}>Certificados</Title>
              <CertificatesList ctx={ctx} />
            </section>
          )}
        </div>
        {ctx.show("interests") && ctx.d.interests.length > 0 && (
          <div style={{ fontSize: 10, color: MUTED }}>
            <strong style={{ color: ctx.accent }}>Interesses: </strong>
            {ctx.d.interests.join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}

export function CVDocument({
  data,
  theme,
  id,
}: {
  data: CVData;
  theme: CVTheme;
  id?: string;
}) {
  const tpl = getTemplate(theme.templateId);
  const fonts = FONT_PAIRS[theme.fontPair] ?? FONT_PAIRS["moderno"]!;
  const ctx: Ctx = {
    d: data,
    t: theme,
    tpl,
    accent: theme.accent,
    gap: 20 * densityScale(theme.density),
    show: (k) => !theme.hidden.includes(k),
    fonts,
  };

  return (
    <div
      id={id}
      style={{
        width: A4_W,
        minHeight: A4_H,
        background: "#fff",
        color: INK,
        fontFamily: fonts.body,
        display: "grid",
        alignContent: "start",
      }}
    >
      {tpl.layout === "sidebar" && <SidebarLayout ctx={ctx} />}
      {tpl.layout === "band" && <BandLayout ctx={ctx} />}
      {tpl.layout === "minimal" && <MinimalLayout ctx={ctx} />}
      {tpl.layout === "timeline" && <TimelineLayout ctx={ctx} />}
      {tpl.layout === "split" && <SplitLayout ctx={ctx} />}
      {tpl.layout === "hero" && <HeroLayout ctx={ctx} />}
      {tpl.layout === "grid" && <GridLayout ctx={ctx} />}
      {tpl.layout === "mono" && <MonoLayout ctx={ctx} />}
      {tpl.layout === "stripe" && <StripeLayout ctx={ctx} />}
      {tpl.layout === "column" && <ColumnLayout ctx={ctx} />}
      <Extras ctx={ctx} />
    </div>
  );
}

export function CVThumb({
  data,
  theme,
  width,
}: {
  data: CVData;
  theme: CVTheme;
  width: number;
}) {
  const scale = width / A4_W;
  return (
    <div
      style={{
        width,
        height: A4_H * scale,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <CVDocument data={data} theme={theme} />
      </div>
    </div>
  );
}
