import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultCoefficients,
  getStoredCoefficients,
  saveCoefficients,
  FormulaCoefficients,
  defaultFormulaStrings,
  getStoredFormulaStrings,
  saveFormulaStrings,
  FormulaStrings,
  getCustomVariables,
} from "@/data/calculatorData";
import { FunctionSquare, RotateCcw, Save, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";


type CoeffKey = keyof FormulaCoefficients;

interface FieldDef {
  key: string;
  label: string;
  hint: string;
}

interface ModelDef {
  id: CoeffKey;
  formulaKey: keyof FormulaStrings;
  title: string;
  fields: FieldDef[];
  formulaVars: string;
  testVars: Record<string, number>; // sample values for preview
}

const CAP_FIELDS: FieldDef[] = [
  { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
  { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
  { key: "c3", label: "c3 — базовый периметр", hint: "Базовый коэф. периметра" },
  { key: "c4", label: "c4 — коэф. X по периметру", hint: "Умножается на X" },
];
const BASE_TEST = { X: 380, Y: 380, H: 500, metalPrice: 510, meshPrice: 350, stainlessPrice: 800, zincPrice065: 420 };

const models: ModelDef[] = [
  {
    id: "cap_classic_simple", formulaKey: "cap_classic_simple",
    title: "Колпак: Классика простой",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
    testVars: { ...BASE_TEST },
  },
  {
    id: "cap_classic_slatted", formulaKey: "cap_classic_slatted",
    title: "Колпак: Классика реечный",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
    testVars: { ...BASE_TEST },
  },
  {
    id: "cap_modern_simple", formulaKey: "cap_modern_simple",
    title: "Колпак: Модерн простой",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
    testVars: { ...BASE_TEST },
  },
  {
    id: "cap_modern_slatted", formulaKey: "cap_modern_slatted",
    title: "Колпак: Модерн реечный",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
    testVars: { ...BASE_TEST },
  },
  {
    id: "box_smooth", formulaKey: "box_smooth",
    title: "Короб: Простой гладкий",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, H, metalPrice, c1, c2",
    testVars: { ...BASE_TEST },
  },
  {
    id: "box_lamellar", formulaKey: "box_lamellar",
    title: "Короб: Ламельный",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — высотный коэф.", hint: "" },
      { key: "c4", label: "c4 — итоговый множитель", hint: "" },
    ],
    formulaVars: "X, Y, H, metalPrice, c1, c2, c3, c4",
    testVars: { ...BASE_TEST },
  },
  {
    id: "flashing_flat", formulaKey: "flashing_flat",
    title: "Оклад: Для плоских покрытий",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — коэф. X по металлу", hint: "" },
      { key: "c4", label: "c4 — коэф. Y по металлу", hint: "" },
    ],
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
    testVars: { ...BASE_TEST },
  },
  {
    id: "flashing_profiled", formulaKey: "flashing_profiled",
    title: "Оклад: Для профилированных покрытий",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — коэф. X по металлу", hint: "" },
      { key: "c4", label: "c4 — коэф. Y по металлу", hint: "" },
      { key: "c5", label: "c5 — стоимость кромки", hint: "₽ за (X+0.5)" },
    ],
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4, c5",
    testVars: { ...BASE_TEST },
  },
  {
    id: "addon_mesh", formulaKey: "addon_mesh",
    title: "Доп. опция: Сетка от птиц",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, meshPrice, c1, c2",
    testVars: { ...BASE_TEST },
  },
  {
    id: "addon_heatproof", formulaKey: "addon_heatproof",
    title: "Доп. опция: Жаростойкая вставка",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, stainlessPrice, c1, c2",
    testVars: { ...BASE_TEST },
  },
  {
    id: "addon_bottom_cap", formulaKey: "addon_bottom_cap",
    title: "Доп. опция: Нижняя крышка",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, metalPrice, c1, c2",
    testVars: { ...BASE_TEST },
  },
  {
    id: "addon_mount_frame", formulaKey: "addon_mount_frame",
    title: "Доп. опция: Установочная рамка",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, zincPrice065, c1, c2",
    testVars: { ...BASE_TEST },
  },
  {
    id: "addon_mount_skeleton", formulaKey: "addon_mount_skeleton",
    title: "Доп. опция: Установочный каркас",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — высотный коэф.", hint: "" },
      { key: "c3", label: "c3 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, H, zincPrice065, c1, c2, c3",
    testVars: { ...BASE_TEST },
  },
];

function evalFormulaPreview(
  expr: string,
  coeffs: Record<string, number>,
  testVars: Record<string, number>
): { ok: boolean; result: number | null; error: string | null } {
  try {
    const customVars = getCustomVariables();
    const allVars = {
      ...Object.fromEntries(customVars.map(v => [v.varName, v.value])),
      ...testVars,
      ...coeffs,
    };
    const keys = Object.keys(allVars);
    const vals = Object.values(allVars);
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `"use strict"; return (${expr});`);
    const result = fn(...vals);
    if (typeof result !== "number" || !isFinite(result)) return { ok: false, result: null, error: "Результат не является числом" };
    return { ok: true, result, error: null };
  } catch (e: unknown) {
    return { ok: false, result: null, error: e instanceof Error ? e.message : "Ошибка" };
  }
}

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

export const FormulaEditor = () => {
  const [coeffs, setCoeffs] = useState<FormulaCoefficients>(getStoredCoefficients);
  const [formulas, setFormulas] = useState<FormulaStrings>(getStoredFormulaStrings);
  const [openId, setOpenId] = useState<CoeffKey | null>(null);

  const handleChange = (modelId: CoeffKey, field: string, raw: string) => {
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    setCoeffs(prev => ({
      ...prev,
      [modelId]: { ...(prev[modelId] as Record<string, number>), [field]: val },
    }));
  };

  const handleFormulaChange = (key: keyof FormulaStrings, value: string) => {
    setFormulas(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveCoefficients(coeffs);
    saveFormulaStrings(formulas);
    toast({ title: "Формулы сохранены" });
  };

  const handleReset = (modelId: CoeffKey, formulaKey: keyof FormulaStrings) => {
    setCoeffs(prev => ({ ...prev, [modelId]: defaultCoefficients[modelId] }));
    setFormulas(prev => ({ ...prev, [formulaKey]: defaultFormulaStrings[formulaKey] }));
    toast({ title: "Сброшено к значениям по умолчанию" });
  };

  return (
    <section className="card-soft p-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Формулы расчёта</h2>
        </div>
        <Button onClick={handleSave} size="sm" className="rounded-xl gap-2">
          <Save className="w-4 h-4" /> Сохранить изменения
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Редактируйте формулы и коэффициенты. При ошибке поле подсветится красным — результат с тестовыми значениями (X=380, Y=380, H=500) виден сразу.
      </p>

      <div className="space-y-2">
        {models.map((m) => {
          const isOpen = openId === m.id;
          const modelCoeffs = coeffs[m.id] as Record<string, number>;
          const defCoeffs = defaultCoefficients[m.id] as Record<string, number>;
          const formulaChanged = formulas[m.formulaKey] !== defaultFormulaStrings[m.formulaKey];
          const hasChanges = formulaChanged || m.fields.some(f => modelCoeffs[f.key] !== defCoeffs[f.key]);

          return (
            <ModelRow
              key={m.id}
              m={m}
              isOpen={isOpen}
              modelCoeffs={modelCoeffs}
              formula={formulas[m.formulaKey]}
              hasChanges={hasChanges}
              formulaChanged={formulaChanged}
              onToggle={() => setOpenId(isOpen ? null : m.id)}
              onCoeffChange={(field, raw) => handleChange(m.id, field, raw)}
              onFormulaChange={(val) => handleFormulaChange(m.formulaKey, val)}
              onReset={() => handleReset(m.id, m.formulaKey)}
            />
          );
        })}
      </div>
    </section>
  );
};

interface ModelRowProps {
  m: ModelDef;
  isOpen: boolean;
  modelCoeffs: Record<string, number>;
  formula: string;
  hasChanges: boolean;
  formulaChanged: boolean;
  onToggle: () => void;
  onCoeffChange: (field: string, raw: string) => void;
  onFormulaChange: (val: string) => void;
  onReset: () => void;
}

const ModelRow = ({
  m, isOpen, modelCoeffs, formula, hasChanges, formulaChanged,
  onToggle, onCoeffChange, onFormulaChange, onReset,
}: ModelRowProps) => {
  const preview = useMemo(
    () => evalFormulaPreview(formula, modelCoeffs, m.testVars),
    [formula, modelCoeffs, m.testVars]
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVar = useCallback((varName: string) => {
    const el = textareaRef.current;
    if (!el) { onFormulaChange(formula + varName); return; }
    const start = el.selectionStart ?? formula.length;
    const end = el.selectionEnd ?? formula.length;
    const newFormula = formula.slice(0, start) + varName + formula.slice(end);
    onFormulaChange(newFormula);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + varName.length, start + varName.length);
    });
  }, [formula, onFormulaChange]);

  const customVars = getCustomVariables();
  const builtInVarNames = m.formulaVars.split(",").map(s => s.trim()).filter(Boolean);
  const customVarNames = customVars.map(v => v.varName);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{m.title}</span>
          {hasChanges && (
            <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded-full">изменено</span>
          )}
        </div>
        <span className="text-muted-foreground text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-3 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">Формула (JS-выражение)</label>
              {preview.ok ? (
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Тест (380×380×500): <strong>{fmt(preview.result!)}</strong></span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <XCircle className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[220px]">{preview.error}</span>
                </div>
              )}
            </div>

            {/* Variable chips - click to insert */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-muted/40 rounded-lg border border-border/40">
              <span className="text-[10px] text-muted-foreground self-center mr-1 shrink-0">Переменные:</span>
              {builtInVarNames.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVar(v)}
                  title={`Вставить "${v}"`}
                  className="text-[10px] font-mono bg-background hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-1.5 py-0.5 rounded transition-colors"
                >
                  {v}
                </button>
              ))}
              {customVarNames.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVar(v)}
                  title={`Пользовательская переменная "${v}" — нажмите чтобы вставить`}
                  className="text-[10px] font-mono bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 hover:border-primary/50 px-1.5 py-0.5 rounded transition-colors"
                >
                  {v} ✦
                </button>
              ))}
              {customVarNames.length === 0 && (
                <span className="text-[10px] text-muted-foreground/50 self-center">— добавьте свои переменные в «Базовые цены»</span>
              )}
            </div>

            <Textarea
              ref={textareaRef}
              value={formula}
              onChange={(e) => onFormulaChange(e.target.value)}
              className={`font-mono text-sm rounded-xl resize-none transition-colors ${
                preview.ok
                  ? "bg-muted border border-border/70"
                  : "bg-destructive/5 border-2 border-destructive"
              }`}
              rows={2}
              spellCheck={false}
            />
            {formulaChanged && (
              <div className="text-[10px] text-muted-foreground mt-1">⚠ Формула изменена относительно значения по умолчанию</div>
            )}
          </div>

          {/* Coefficients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {m.fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-foreground">{f.label}</label>
                {f.hint && <span className="text-[10px] text-muted-foreground ml-1">— {f.hint}</span>}
                <Input
                  type="number"
                  step="any"
                  value={modelCoeffs[f.key]}
                  onChange={(e) => onCoeffChange(f.key, e.target.value)}
                  className="mt-1 bg-muted border-0 rounded-xl text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground gap-1.5" onClick={onReset}>
              <RotateCcw className="w-3.5 h-3.5" /> Сбросить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

