import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Ruler, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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
  const [smallH, setSmallH] = useState(0);
  const [autoAngle, setAutoAngle] = useState(false);

  const recalcAngle = (Y: number, H: number, h: number) => {
    if (Y > 0 && H > h && h > 0) {
      const deg = Math.round(Math.atan((H - h) / Y) * (180 / Math.PI) * 10) / 10;
      calc.setRoofAngle(deg);
      setAutoAngle(true);
    } else {
      setAutoAngle(false);
    }
  };

  const handleXChange = (v: number) => calc.setDimensionX(v);
  const handleYChange = (v: number) => { calc.setDimensionY(v); recalcAngle(v, calc.dimensionH, smallH); };
  const handleHChange = (v: number) => { calc.setDimensionH(v); recalcAngle(calc.dimensionY, v, smallH); };
  const handleSmallHChange = (v: number) => { setSmallH(v); recalcAngle(calc.dimensionY, calc.dimensionH, v); };
  const handleAngleChange = (v: number) => { calc.setRoofAngle(v); setAutoAngle(false); };

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

      {/* Схема + параметры */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">

        {/* Схема замеров — всегда видна */}
        <div className="sm:w-44 flex-shrink-0 w-full">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Схема замеров</p>
          <img
            src="/calculator/measurement-diagram.jpg"
            alt="Схема замеров трубы"
            className="w-full rounded-xl border border-border object-contain"
          />
        </div>

        {/* Поля ввода */}
        <div className="flex-1 w-full space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Параметры</p>

          {/* X, Y */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0, duration: 0.3 }}>
              <label className="text-sm font-bold text-foreground">
                <span className="text-[hsl(38,75%,45%)]">X</span>{" "}
                <span className="text-muted-foreground font-normal">(ширина трубы)</span>
              </label>
              <NumericInput value={calc.dimensionX} onChange={handleXChange} unit="мм" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05, duration: 0.3 }}>
              <label className="text-sm font-bold text-foreground">
                <span className="text-destructive">Y</span>{" "}
                <span className="text-muted-foreground font-normal">(глубина трубы)</span>
              </label>
              <NumericInput value={calc.dimensionY} onChange={handleYChange} unit="мм" />
            </motion.div>
          </div>

          {/* H, h */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
              <label className="text-sm font-bold text-foreground">
                <span className="text-[hsl(155,55%,38%)]">H</span>{" "}
                <span className="text-muted-foreground font-normal">(высота над кровлей)</span>
              </label>
              <NumericInput value={calc.dimensionH} onChange={handleHChange} unit="мм" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.3 }}>
              <label className="text-sm font-bold text-foreground">
                <span className="text-[hsl(155,55%,38%)]">h</span>{" "}
                <span className="text-muted-foreground font-normal">(высота у края кровли)</span>
              </label>
              <NumericInput value={smallH} onChange={handleSmallHChange} unit="мм" />
            </motion.div>
          </div>

          {/* α — с авто-расчётом */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.3 }}>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-sm font-bold text-foreground">
                <span className="text-[hsl(280,60%,50%)]">α</span>{" "}
                <span className="text-muted-foreground font-normal">(угол наклона кровли)</span>
              </label>
              {autoAngle && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Zap className="w-3 h-3" />
                  рассчитан автоматически
                </span>
              )}
            </div>
            <NumericInput value={calc.roofAngle} onChange={handleAngleChange} unit="°" />
            {!autoAngle && (
              <p className="text-xs text-muted-foreground mt-1">
                Введите H и h — угол рассчитается автоматически по формуле arctg((H−h)/Y)
              </p>
            )}
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
};

export default DimensionsForm;
export { NumericInput };
