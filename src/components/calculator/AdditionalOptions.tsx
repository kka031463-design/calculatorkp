import { useCalculator } from "@/context/CalculatorContext";
import { addonOptions, AddonId } from "@/data/calculatorData";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2 } from "lucide-react";
import { motion } from "framer-motion";

const AdditionalOptions = () => {
  const { selectedAddons, toggleAddon, capModel, boxModel } = useCalculator();

  const available = addonOptions.filter((opt) => {
    if (opt.appliesTo === "cap") return capModel !== "custom";
    if (opt.appliesTo === "box") return boxModel !== "none";
    return true;
  });

  if (available.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Дополнительные опции</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {available.map((opt, i) => {
          const checked = selectedAddons.includes(opt.id);
          return (
            <motion.label
              key={opt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                checked ? "bg-primary/5 border border-primary/20" : "bg-muted border border-transparent hover:border-primary/10"
              }`}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggleAddon(opt.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
              />
              <span className="text-sm font-semibold text-foreground">{opt.name}</span>
            </motion.label>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdditionalOptions;
