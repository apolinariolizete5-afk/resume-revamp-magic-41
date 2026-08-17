import type { CVData } from "./types";

const fileName = (data: CVData, ext: string) =>
  `CV-${(data.name || "curriculo").replace(/[^\p{L}\p{N}]+/gu, "-")}.${ext}`;

export async function exportPDF(node: HTMLElement, data: CVData) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  // Render an unscaled, full-width copy off-screen so the capture is identical
  // on mobile and desktop (no ancestor transform / width constraints).
  const holder = document.createElement("div");
  holder.style.cssText =
    "position:fixed;top:0;left:0;width:794px;background:#ffffff;z-index:-1;opacity:1;pointer-events:none;";
  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.width = "794px";
  holder.appendChild(clone);
  document.body.appendChild(holder);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: 794,
      windowHeight: clone.scrollHeight,
    });
  } finally {
    holder.remove();
  }



  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pageW) / canvas.width;
  const pages = Math.max(1, Math.ceil(imgH / pageH - 0.06));

  for (let i = 0; i < pages; i++) {
    if (i > 0) pdf.addPage();
    const sliceHeightPx = Math.min(
      canvas.height - (i * canvas.height * pageH) / imgH,
      (canvas.height * pageH) / imgH,
    );
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = Math.round(sliceHeightPx);
    const ctx = slice.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(
      canvas,
      0,
      Math.round((i * canvas.height * pageH) / imgH),
      canvas.width,
      slice.height,
      0,
      0,
      canvas.width,
      slice.height,
    );
    const h = (slice.height * pageW) / slice.width;
    pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageW, h);
  }

  pdf.save(fileName(data, "pdf"));
}

export async function exportDOCX(data: CVData) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    LevelFormat,
  } = await import("docx");

  const heading = (text: string) =>
    new Paragraph({
      spacing: { before: 280, after: 120 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 4 },
      },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24 })],
    });

  const body: InstanceType<typeof Paragraph>[] = [];

  body.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: data.name || "Currículo", bold: true, size: 40 })],
    }),
  );
  if (data.job) {
    body.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.job, size: 24, color: "444444" })],
      }),
    );
  }
  const contacts = [data.phone, data.email, data.location, data.link].filter(Boolean).join(" | ");
  if (contacts) {
    body.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: contacts, size: 20, color: "666666" })],
      }),
    );
  }

  if (data.summary) {
    body.push(heading("Resumo profissional"));
    body.push(new Paragraph({ children: [new TextRun({ text: data.summary, size: 22 })] }));
  }

  if (data.experiences.length) {
    body.push(heading("Experiência profissional"));
    data.experiences.forEach((e) => {
      body.push(
        new Paragraph({
          spacing: { before: 140 },
          children: [
            new TextRun({ text: e.role, bold: true, size: 23 }),
            new TextRun({ text: e.period ? `  —  ${e.period}` : "", size: 20, color: "666666" }),
          ],
        }),
      );
      if (e.company) {
        body.push(
          new Paragraph({
            children: [new TextRun({ text: e.company, italics: true, size: 21, color: "444444" })],
          }),
        );
      }
      e.description
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((l) =>
          body.push(
            new Paragraph({
              numbering: { reference: "cv-bullets", level: 0 },
              children: [new TextRun({ text: l, size: 21 })],
            }),
          ),
        );
    });
  }

  if (data.education.length) {
    body.push(heading("Formação académica"));
    data.education.forEach((e) => {
      body.push(
        new Paragraph({
          spacing: { before: 120 },
          children: [
            new TextRun({ text: e.course, bold: true, size: 22 }),
            new TextRun({ text: e.period ? `  —  ${e.period}` : "", size: 20, color: "666666" }),
          ],
        }),
      );
      if (e.school) {
        body.push(new Paragraph({ children: [new TextRun({ text: e.school, size: 21 })] }));
      }
      if (e.description) {
        body.push(
          new Paragraph({ children: [new TextRun({ text: e.description, size: 20, color: "555555" })] }),
        );
      }
    });
  }

  if (data.skills.length) {
    body.push(heading("Competências"));
    data.skills.forEach((s) =>
      body.push(
        new Paragraph({
          numbering: { reference: "cv-bullets", level: 0 },
          children: [new TextRun({ text: s, size: 21 })],
        }),
      ),
    );
  }

  if (data.languages.length) {
    body.push(heading("Idiomas"));
    data.languages.forEach((l) =>
      body.push(
        new Paragraph({
          numbering: { reference: "cv-bullets", level: 0 },
          children: [new TextRun({ text: `${l.name} — ${l.level}`, size: 21 })],
        }),
      ),
    );
  }

  if (data.certificates.length) {
    body.push(heading("Certificados"));
    data.certificates.forEach((c) =>
      body.push(
        new Paragraph({
          numbering: { reference: "cv-bullets", level: 0 },
          children: [
            new TextRun({
              text: [c.name, c.issuer, c.year].filter(Boolean).join(" | "),
              size: 21,
            }),
          ],
        }),
      ),
    );
  }

  if (data.courses.length) {
    body.push(heading("Cursos e formações"));
    data.courses.forEach((c) =>
      body.push(
        new Paragraph({
          numbering: { reference: "cv-bullets", level: 0 },
          children: [
            new TextRun({ text: c.name, bold: true, size: 21 }),
            new TextRun({
              text: [c.provider, c.year].filter(Boolean).length
                ? ` — ${[c.provider, c.year].filter(Boolean).join(", ")}`
                : "",
              size: 20,
              color: "666666",
            }),
          ],
        }),
      ),
    );
  }

  data.customSections
    .filter((c) => c.title.trim() || c.content.trim())
    .forEach((c) => {
      body.push(heading(c.title || "Secção"));
      c.content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((l) =>
          body.push(
            new Paragraph({
              numbering: { reference: "cv-bullets", level: 0 },
              children: [new TextRun({ text: l, size: 21 })],
            }),
          ),
        );
    });

  if (data.references.length) {
    body.push(heading("Referências"));
    data.references.forEach((r) =>
      body.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({ text: r.name, bold: true, size: 21 }),
            new TextRun({
              text: [r.role, r.contact].filter(Boolean).length
                ? ` — ${[r.role, r.contact].filter(Boolean).join(" | ")}`
                : "",
              size: 20,
              color: "555555",
            }),
          ],
        }),
      ),
    );
  }

  if (data.interests.length) {
    body.push(heading("Interesses"));
    body.push(
      new Paragraph({ children: [new TextRun({ text: data.interests.join(", "), size: 21 })] }),
    );
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    numbering: {
      config: [
        {
          reference: "cv-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 480, hanging: 240 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children: body,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName(data, "docx");
  a.click();
  URL.revokeObjectURL(url);
}
