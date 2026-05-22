import { useCalculator } from "@/context/CalculatorContext";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
const MetalForm = () => {
  const {
    metalCoating, setMetalCoating, metalColor, setMetalColor,
    coatings, colors,
  } = useCalculator();

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

      </div>

    </motion.div>
  );
};

export default MetalForm;
