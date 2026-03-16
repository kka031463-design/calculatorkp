import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Ruler } from "lucide-react";
import { motion } from "framer-motion";
import PipeSchematic from "./PipeSchematic";
import { useState } from "react";

const fields = [
  { key: "dimensionX" as const, label: "X", unit: "мм", desc: "ширина трубы", color: "text-[hsl(38,75%,45%)]" },
  { key: "dimensionY" as const, label: "Y", unit: "мм", desc: "глубина трубы", color: "text-destructive" },
  { key: "dimensionH" as const, label: "H", unit: "мм", desc: "высота над кровлей", color: "text-[hsl(155,55%,38%)]" },
  { key: "roofAngle" as const, label: "α", unit: "°", desc: "угол наклона кровли", color: "text-[hsl(280,60%,50%)]" },
];

const setters = {
  dimensionX: "setDimensionX",
  dimensionY: "setDimensionY",
  dimensionH: "setDimensionH",
  roofAngle: "setRoofAngle",
} as const;

const parseNum = (v: string) => {
  const cleaned = v.replace(",", ".").replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const NumericInput = ({ value, onChange, unit, className }: {
  value: number; onChange: (v: number) => void; unit: string; className?: string;
}) => {
  const [local, setLocal] = useState(String(value));
  const [focused, setFocused] = useState(false);

  const display = focused ? local : (value === 0 ? "" : String(value));

  return (
    <div className="relative mt-1">
      <Input
        type="text"
        inputMode="decimal"
        value={display}
        onFocus={() => { setLocal(value === 0 ? "" : String(value)); setFocused(true); }}
        onBlur={() => { setFocused(false); onChange(parseNum(local)); }}
        onChange={(e) => { setLocal(e.target.value); onChange(parseNum(e.target.value)); }}
        className={className || "bg-muted border-0 rounded-xl pr-10"}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {unit}
      </span>
    </div>
  );
};

const DimensionsForm = () => {
  const calc = useCalculator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2">
        <Ruler className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Размеры трубы</h3>
      </div>

      <PipeSchematic />

      <div className="grid grid-cols-2 gap-3">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <label className="text-sm font-bold text-foreground">
              <span className={f.color}>{f.label}</span>{" "}
              <span className="text-muted-foreground font-normal">({f.desc})</span>
            </label>
            <NumericInput
              value={calc[f.key]}
              onChange={(v) => (calc as any)[setters[f.key]](v)}
              unit={f.unit}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DimensionsForm;
export { NumericInput };
