import { useCalculator } from "@/context/CalculatorContext";
import { addonOptions } from "@/data/calculatorData";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const OptionItem = ({
  opt,
  checked,
  onToggle,
  index,
}: {
  opt: typeof addonOptions[0];
  checked: boolean;
  onToggle: () => void;
  index: number;
}) => (
  <motion.label
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
      checked ? "bg-primary/5 border border-primary/20" : "bg-muted border border-transparent hover:border-primary/10"
    }`}
  >
    <Checkbox
      checked={checked}
      onCheckedChange={onToggle}
      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
    />
    <span className="text-sm font-semibold text-foreground">{opt.name}</span>
  </motion.label>
);

const AdditionalOptions = () => {
  const { selectedAddons, toggleAddon, capModel, boxModel } = useCalculator();

  const available = addonOptions.filter((opt) => {
    if (opt.appliesTo === "cap") return capModel !== "custom";
    if (opt.appliesTo === "box") return boxModel !== "none";
    return true;
  });

  const mainOptions = available.filter(opt => !opt.id.startsWith("mount_"));
  const mountOptions = available.filter(opt => opt.id.startsWith("mount_"));

  if (available.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Дополнительные опции */}
      {mainOptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Дополнительные опции</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mainOptions.map((opt, i) => (
              <OptionItem
                key={opt.id}
                opt={opt}
                checked={selectedAddons.includes(opt.id)}
                onToggle={() => toggleAddon(opt.id)}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Крепление — отдельный блок */}
      {mountOptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Крепление</h3>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Выберите тип крепления для монтажа короба. Влияет на итоговую стоимость комплекта.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mountOptions.map((opt, i) => (
                <OptionItem
                  key={opt.id}
                  opt={opt}
                  checked={selectedAddons.includes(opt.id)}
                  onToggle={() => toggleAddon(opt.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdditionalOptions;
