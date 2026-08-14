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
  layout: "sidebar" | "band" | "minimal" | "timeline" | "split";
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
        overflow: "hidden",
        display: "grid",
      }}
    >
      {tpl.layout === "sidebar" && <SidebarLayout ctx={ctx} />}
      {tpl.layout === "band" && <BandLayout ctx={ctx} />}
      {tpl.layout === "minimal" && <MinimalLayout ctx={ctx} />}
      {tpl.layout === "timeline" && <TimelineLayout ctx={ctx} />}
      {tpl.layout === "split" && <SplitLayout ctx={ctx} />}
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
