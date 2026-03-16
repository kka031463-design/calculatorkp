// New pricing data and formulas based on Excel specification

// === Cap Models ===
export type CapModel = "classic_simple" | "classic_slatted" | "modern_simple" | "modern_slatted" | "custom";
export const capModels: { id: CapModel; name: string; description: string }[] = [
  { id: "classic_simple", name: "Классика простой", description: "Традиционный колпак с гладкой отделкой" },
  { id: "classic_slatted", name: "Классика реечный", description: "Классический колпак с реечным оформлением" },
  { id: "modern_simple", name: "Модерн простой", description: "Современный колпак с лаконичным дизайном" },
  { id: "modern_slatted", name: "Модерн реечный", description: "Современный колпак с реечной отделкой" },
  { id: "custom", name: "По эскизу", description: "Индивидуальный проект по вашему эскизу" },
];

// === Box Models ===
export type BoxModel = "smooth" | "lamellar" | "none";
export const boxModels: { id: BoxModel; name: string; description: string }[] = [
  { id: "none", name: "Без короба", description: "Короб не требуется" },
  { id: "smooth", name: "Простой гладкий", description: "Гладкий короб для обхода трубы" },
  { id: "lamellar", name: "Ламельный", description: "Декоративный короб с ламелями" },
];

// === Flashing Models ===
export type FlashingModel = "flat" | "profiled" | "none";
export const flashingModels: { id: FlashingModel; name: string; description: string }[] = [
  { id: "none", name: "Без оклада", description: "Оклад не требуется" },
  { id: "flat", name: "Для плоских покрытий", description: "Оклад для плоских кровельных покрытий" },
  { id: "profiled", name: "Для профилированных покрытий", description: "Оклад для профилированных кровельных покрытий" },
];

// === Additional Options ===
export type AddonId = "mesh" | "heatproof" | "bottom_cap" | "gas_passthrough" | "mount_frame" | "mount_skeleton";
export interface AddonOption {
  id: AddonId;
  name: string;
  description: string;
  appliesTo: "cap" | "box" | "all";
}
export const addonOptions: AddonOption[] = [
  { id: "mesh", name: "Сетка от птиц", description: "Защитная сетка от проникновения птиц", appliesTo: "cap" },
  { id: "heatproof", name: "Жаростойкая вставка", description: "Вставка из нержавеющей стали", appliesTo: "cap" },
  { id: "bottom_cap", name: "Нижняя крышка", description: "Нижняя крышка колпака", appliesTo: "cap" },
  { id: "gas_passthrough", name: "Проходка газового котла", description: "Для классики — 2500 ₽, для модерна — 1800 ₽", appliesTo: "cap" },
  { id: "mount_frame", name: "Установочная рамка", description: "Рамка для монтажа короба", appliesTo: "box" },
  { id: "mount_skeleton", name: "Установочный каркас", description: "Несущий каркас для монтажа короба", appliesTo: "box" },
];

// === Metal Coatings ===
export const defaultCoatings = [
  "без покрытия 0,45",
  "без покрытия 0,65",
  "полиэстер",
  "полиэстер текстура",
  "satin",
  "velur",
  "PUR",
  "PUR mat",
  "бархат",
];

// === Metal Colors ===
export const defaultColors = [
  { code: "цинк", name: "Цинк" },
  { code: "RAL 7024", name: "Графитовый серый" },
  { code: "RAL 8017", name: "Шоколадно-коричневый" },
  { code: "RAL 9005", name: "Чёрный" },
  { code: "RAL 8019", name: "Серо-коричневый" },
  { code: "RAL 6005", name: "Зелёный мох" },
  { code: "RAL 7004", name: "Сигнальный серый" },
  { code: "RAL 5005", name: "Сигнальный синий" },
  { code: "RAL 3011", name: "Коричнево-красный" },
  { code: "RAL 3005", name: "Винно-красный" },
  { code: "RR 32", name: "Тёмно-коричневый" },
  { code: "нержавейка", name: "Нержавеющая сталь" },
];

// === Special material keys in price matrix ===
export const specialMaterials = ["сетка", "нержавейка", "цинк 0,65"] as const;

// === Default metal price (user can edit in settings) ===
export const DEFAULT_METAL_PRICE = 510;

// === Formula Coefficients ===
export interface FormulaCoefficients {
  cap_classic_simple:  { c1: number; c2: number; c3: number; c4: number };
  cap_classic_slatted: { c1: number; c2: number; c3: number; c4: number };
  cap_modern_simple:   { c1: number; c2: number; c3: number; c4: number };
  cap_modern_slatted:  { c1: number; c2: number; c3: number; c4: number };
  box_smooth:          { c1: number; c2: number };
  box_lamellar:        { c1: number; c2: number; c3: number; c4: number };
  flashing_flat:       { c1: number; c2: number; c3: number; c4: number };
  flashing_profiled:   { c1: number; c2: number; c3: number; c4: number; c5: number };
  addon_mesh:          { c1: number; c2: number };
  addon_heatproof:     { c1: number; c2: number };
  addon_bottom_cap:    { c1: number; c2: number };
  addon_mount_frame:   { c1: number; c2: number };
  addon_mount_skeleton:{ c1: number; c2: number; c3: number };
}

export const defaultCoefficients: FormulaCoefficients = {
  cap_classic_simple:  { c1: 0.001,  c2: 1500, c3: 0.25,  c4: 0.00075 },
  cap_classic_slatted: { c1: 0.0015, c2: 1500, c3: 0.625, c4: 0.00075 },
  cap_modern_simple:   { c1: 0.001,  c2: 1000, c3: 0.25,  c4: 0.00065 },
  cap_modern_slatted:  { c1: 0.0015, c2: 1500, c3: 0.625, c4: 0.00065 },
  box_smooth:          { c1: 0.0025, c2: 2500 },
  box_lamellar:        { c1: 0.0025, c2: 2500, c3: 1.6,   c4: 3.2 },
  flashing_flat:       { c1: 0.002,  c2: 2000, c3: 0.00125, c4: 0.00085 },
  flashing_profiled:   { c1: 0.002,  c2: 3000, c3: 0.00125, c4: 0.001,  c5: 500 },
  addon_mesh:          { c1: 0.0005, c2: 500 },
  addon_heatproof:     { c1: 0.000001, c2: 500 },
  addon_bottom_cap:    { c1: 0.000001, c2: 500 },
  addon_mount_frame:   { c1: 0.0005, c2: 500 },
  addon_mount_skeleton:{ c1: 0.001, c2: 0.004, c3: 2500 },
};

export function getStoredCoefficients(): FormulaCoefficients {
  try {
    const saved = localStorage.getItem("pipe_formula_coefficients");
    if (saved) return { ...defaultCoefficients, ...JSON.parse(saved) };
  } catch {}
  return defaultCoefficients;
}

export function saveCoefficients(c: FormulaCoefficients) {
  localStorage.setItem("pipe_formula_coefficients", JSON.stringify(c));
}

// === Formula Strings (editable) ===
export interface FormulaStrings {
  cap_classic_simple: string;
  cap_classic_slatted: string;
  cap_modern_simple: string;
  cap_modern_slatted: string;
  box_smooth: string;
  box_lamellar: string;
  flashing_flat: string;
  flashing_profiled: string;
  addon_mesh: string;
  addon_heatproof: string;
  addon_bottom_cap: string;
  addon_mount_frame: string;
  addon_mount_skeleton: string;
}

export const defaultFormulaStrings: FormulaStrings = {
  cap_classic_simple:   "((X * Y * c1 + c2) + (X + Y) * 0.002 * (c3 + c4 * X) * metalPrice) * 4.2",
  cap_classic_slatted:  "((X * Y * c1 + c2) + (X + Y) * 0.002 * (c3 + c4 * X) * metalPrice) * 4",
  cap_modern_simple:    "((X * Y * c1 + c2) + (X + Y) * 0.002 * (c3 + c4 * X) * metalPrice) * 4",
  cap_modern_slatted:   "((X * Y * c1 + c2) + (X + Y) * 0.002 * (c3 + c4 * X) * metalPrice) * 4.2",
  box_smooth:           "((X * Y * c1 + c2) + (X + Y) * 0.002 * H * metalPrice) * 3.5",
  box_lamellar:         "((X * Y * c1 + c2) * 2 + (X + Y) * 0.002 * c3 * H * metalPrice) * 3.2",
  flashing_flat:        "((X * Y * c1 + c2) + (X * c3 + Y * c4) * metalPrice) * 4",
  flashing_profiled:    "((X * Y * c1 + c2) + (X * c3 + Y * c4) * metalPrice + (X + 0.5) * c5) * 4",
  addon_mesh:           "((X + Y) * c1 * meshPrice * 1.2 + c2) * 4",
  addon_heatproof:      "(X * Y * c1 * 1.2 * stainlessPrice + c2) * 3",
  addon_bottom_cap:     "(X * Y * c1 * 1.2 * metalPrice + c2) * 3",
  addon_mount_frame:    "((X + Y) * c1 * zincPrice065 * 1.2 + c2) * 3.5",
  addon_mount_skeleton: "(((X + Y) * c1 + H * c2) * zincPrice065 * 1.2 + c3) * 3.5",
};

export function getStoredFormulaStrings(): FormulaStrings {
  try {
    const saved = localStorage.getItem("pipe_formula_strings");
    if (saved) return { ...defaultFormulaStrings, ...JSON.parse(saved) };
  } catch {}
  return defaultFormulaStrings;
}

export function saveFormulaStrings(f: FormulaStrings) {
  localStorage.setItem("pipe_formula_strings", JSON.stringify(f));
}

function evalFormula(expr: string, vars: Record<string, number>): number {
  try {
    // Merge custom variables (user-defined) into the scope
    const customVars = getCustomVariables();
    const allVars = { ...Object.fromEntries(customVars.map(v => [v.varName, v.value])), ...vars };
    const keys = Object.keys(allVars);
    const vals = Object.values(allVars);
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `"use strict"; return (${expr});`);
    const result = fn(...vals);
    return typeof result === "number" && isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}


// === Pricing Formulas ===
// X, Y in mm; H in mm; metalPrice = price per unit from matrix
// Formulas are stored as JS expressions in localStorage and evaluated dynamically.

export function calcCapPrice(model: CapModel, X: number, Y: number, metalPrice: number): number {
  if (model === "custom") return 0;
  const co = getStoredCoefficients();
  const fs = getStoredFormulaStrings();
  const key = `cap_${model}` as keyof FormulaStrings;
  const { c1, c2, c3, c4 } = co[key as keyof FormulaCoefficients] as { c1: number; c2: number; c3: number; c4: number };
  return evalFormula(fs[key], { X, Y, metalPrice, c1, c2, c3, c4 });
}

export function calcBoxPrice(model: BoxModel, X: number, Y: number, H: number, metalPrice: number): number {
  if (model === "none") return 0;
  const co = getStoredCoefficients();
  const fs = getStoredFormulaStrings();
  const key = `box_${model}` as keyof FormulaStrings;
  const coeffs = co[key as keyof FormulaCoefficients] as Record<string, number>;
  return evalFormula(fs[key], { X, Y, H, metalPrice, ...coeffs });
}

export function calcFlashingPrice(model: FlashingModel, X: number, Y: number, metalPrice: number): number {
  if (model === "none") return 0;
  const co = getStoredCoefficients();
  const fs = getStoredFormulaStrings();
  const key = `flashing_${model}` as keyof FormulaStrings;
  const coeffs = co[key as keyof FormulaCoefficients] as Record<string, number>;
  return evalFormula(fs[key], { X, Y, metalPrice, ...coeffs });
}

export function calcAddonPrice(
  addonId: AddonId,
  capModel: CapModel,
  X: number, Y: number, H: number,
  metalPrice: number,
  meshPrice: number,
  stainlessPrice: number,
  zincPrice065: number
): number {
  if (addonId === "gas_passthrough") return capModel.startsWith("classic") ? 2500 : 1800;
  const co = getStoredCoefficients();
  const fs = getStoredFormulaStrings();
  const key = `addon_${addonId}` as keyof FormulaStrings;
  const coeffs = co[key as keyof FormulaCoefficients] as Record<string, number>;
  return evalFormula(fs[key], { X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065, ...coeffs });
}


// === Custom Formula Variables ===
export interface CustomVariable {
  id: string;
  name: string;       // display label
  varName: string;    // JS identifier for use in formulas
  value: number;
}

export function getCustomVariables(): CustomVariable[] {
  try {
    const saved = localStorage.getItem("pipe_custom_variables");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function saveCustomVariables(vars: CustomVariable[]) {
  localStorage.setItem("pipe_custom_variables", JSON.stringify(vars));
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

