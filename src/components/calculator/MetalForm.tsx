import { useCalculator } from "@/context/CalculatorContext";
import { Palette, DollarSign, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { NumericInput } from "./DimensionsForm";

const MetalForm = () => {
  const {
    metalCoating, setMetalCoating, metalColor, setMetalColor,
    metalPrice, setMetalPrice, meshPrice, setMeshPrice,
    stainlessPrice, setStainlessPrice, zincPrice065, setZincPrice065,
    coatings, colors, priceMatrix,
  } = useCalculator();

  const matrixPrice = priceMatrix[metalCoating]?.[metalColor];
  const hasMatrixPrice = matrixPrice !== undefined && matrixPrice > 0;

  const priceFields = [
    { label: "Цена металла", value: metalPrice, setter: setMetalPrice },
    { label: "Цена сетки", value: meshPrice, setter: setMeshPrice },
    { label: "Цена нержавейки", value: stainlessPrice, setter: setStainlessPrice },
    { label: "Цена цинка 0,65", value: zincPrice065, setter: setZincPrice065 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Металл и покрытие</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-bold text-foreground">Покрытие металла</label>
          <Select value={metalCoating} onValueChange={setMetalCoating}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {coatings.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Цвет металла</label>
          <Select value={metalColor} onValueChange={setMetalColor}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {colors.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.code} — {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasMatrixPrice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 rounded-lg px-3 py-2"
          >
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Цена из матрицы: <strong className="text-primary">{matrixPrice} руб</strong></span>
          </motion.div>
        )}
      </div>

      {/* Price inputs */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-foreground">Цены материалов (руб)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {priceFields.map((pf) => (
            <div key={pf.label}>
              <label className="text-xs text-muted-foreground">{pf.label}</label>
              <NumericInput
                value={pf.value}
                onChange={pf.setter}
                unit="₽"
                className="mt-0.5 bg-muted border-0 rounded-xl text-sm h-9 pr-8"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MetalForm;
