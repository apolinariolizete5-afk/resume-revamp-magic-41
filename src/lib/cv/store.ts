import { useCallback, useEffect, useState } from "react";
import { emptyCV, type CVData, type CVState, type CVTheme } from "./types";
import { getTemplate } from "@/components/cv/CVDocument";

const KEY = "moza-cv-v1";

export const defaultTheme = (templateId = "aurora"): CVTheme => {
  const tpl = getTemplate(templateId);
  return {
    templateId: tpl.id,
    accent: tpl.accent,
    fontPair: String(tpl.fontPair),
    density: "normal",
    hidden: [],
  };
};

export const defaultState = (): CVState => ({ data: emptyCV(), theme: defaultTheme() });

export function loadState(): CVState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CVState;
    if (!parsed?.data || !parsed?.theme) return null;
    return { data: { ...emptyCV(), ...parsed.data }, theme: { ...defaultTheme(), ...parsed.theme } };
  } catch {
    return null;
  }
}

export function saveState(state: CVState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export function useCVState() {
  const [state, setState] = useState<CVState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadState();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const setData = useCallback((patch: Partial<CVData> | ((d: CVData) => CVData)) => {
    setState((s) => ({
      ...s,
      data: typeof patch === "function" ? patch(s.data) : { ...s.data, ...patch },
    }));
  }, []);

  const setTheme = useCallback((patch: Partial<CVTheme>) => {
    setState((s) => ({ ...s, theme: { ...s.theme, ...patch } }));
  }, []);

  return { state, setState, setData, setTheme, hydrated };
}

/* ---------------- biblioteca de CVs guardados ---------------- */

const LIB_KEY = "moza-cv-library-v1";

export type SavedCV = {
  id: string;
  title: string;
  updatedAt: number;
  state: CVState;
};

export function listSavedCVs(): SavedCV[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIB_KEY);
    const list = raw ? (JSON.parse(raw) as SavedCV[]) : [];
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

function writeLibrary(list: SavedCV[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LIB_KEY, JSON.stringify(list));
  } catch {
    throw new Error("Sem espaço para guardar. Elimine um CV guardado e tente novamente.");
  }
}

export function saveCV(state: CVState, title?: string, id?: string): SavedCV[] {
  const list = listSavedCVs();
  const name =
    title?.trim() ||
    `${state.data.name || "CV sem nome"}${state.data.job ? ` — ${state.data.job}` : ""}`;
  const existingIndex = id ? list.findIndex((c) => c.id === id) : -1;
  const entry: SavedCV = {
    id: id ?? Math.random().toString(36).slice(2, 10),
    title: name,
    updatedAt: Date.now(),
    state,
  };
  if (existingIndex >= 0) list[existingIndex] = entry;
  else list.unshift(entry);
  writeLibrary(list.slice(0, 30));
  return listSavedCVs();
}

export function deleteCV(id: string): SavedCV[] {
  writeLibrary(listSavedCVs().filter((c) => c.id !== id));
  return listSavedCVs();
}

export function scoreCV(data: CVData) {
  const tips: string[] = [];
  let score = 0;
  const add = (ok: boolean, pts: number, tip: string) => {
    if (ok) score += pts;
    else tips.push(tip);
  };
  add(!!data.name && !!data.job, 10, "Preencha o nome e o cargo pretendido.");
  add(!!data.phone && !!data.email, 10, "Adicione telefone e email de contacto.");
  add(!!data.photo, 8, "Anexe uma foto profissional.");
  add(data.summary.length > 120, 16, "Escreva um resumo com pelo menos 3 linhas.");
  add(data.experiences.length >= 2, 18, "Inclua pelo menos duas experiências profissionais.");
  add(
    data.experiences.every((e) => e.period.trim().length > 0) && data.experiences.length > 0,
    8,
    "Indique o período (datas) de cada experiência.",
  );
  add(
    data.experiences.some((e) => /\d/.test(e.description)),
    8,
    "Use números e resultados nas descrições (ex.: aumentei vendas em 30%).",
  );
  add(data.education.length >= 1, 10, "Adicione a sua formação académica.");
  add(data.skills.length >= 5, 8, "Liste pelo menos 5 competências.");
  add(data.languages.length >= 1, 4, "Indique os idiomas que domina.");
  return { score: Math.min(100, score), tips };
}
