import { useCalculator } from "@/context/CalculatorContext";
import {
  calcCapPrice, calcBoxPrice, calcFlashingPrice, calcAddonPrice,
  capModels, boxModels, flashingModels, addonOptions,
  formatPrice,
} from "@/data/calculatorData";
import { Calculator, ChevronDown, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NumericInput } from "./DimensionsForm";

interface LineItem {
  key: string;
  name: string;
  price: number;
}

const CostSummary = () => {
  const calc = useCalculator();
  const [expanded, setExpanded] = useState(true);
  const { dimensionX: X, dimensionY: Y, dimensionH: H,
    metalPrice, meshPrice, stainlessPrice, zincPrice065,
    capModel, boxModel, flashingModel, selectedAddons,
    discount, setDiscount, itemDiscounts, setItemDiscount } = calc;

  const lines: LineItem[] = [];

  if (capModel !== "custom") {
    const capInfo = capModels.find(c => c.id === capModel);
    lines.push({ key: "cap", name: `Колпак: ${capInfo?.name || capModel}`, price: calcCapPrice(capModel, X, Y, metalPrice) });
  } else {
    lines.push({ key: "cap", name: "Колпак: по эскизу (индивидуально)", price: 0 });
  }

  if (boxModel !== "none") {
    const boxInfo = boxModels.find(b => b.id === boxModel);
    lines.push({ key: "box", name: `Короб: ${boxInfo?.name || boxModel}`, price: calcBoxPrice(boxModel, X, Y, H, metalPrice) });
  }

  if (flashingModel !== "none") {
    const flashInfo = flashingModels.find(f => f.id === flashingModel);
    lines.push({ key: "flashing", name: `Оклад: ${flashInfo?.name || flashingModel}`, price: calcFlashingPrice(flashingModel, X, Y, metalPrice) });
  }

  selectedAddons.forEach(addonId => {
    const opt = addonOptions.find(a => a.id === addonId);
    if (opt) {
      lines.push({ key: `addon_${addonId}`, name: opt.name, price: calcAddonPrice(addonId, capModel, X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065) });
    }
  });

  // Calculate total with per-item discounts applied first, then global discount
  const totalBeforeGlobal = lines.reduce((s, l) => {
    const itemDisc = itemDiscounts[l.key] || 0;
    return s + l.price * (1 - itemDisc / 100);
  }, 0);
  const discountedTotal = totalBeforeGlobal * (1 - discount / 100);
  const totalRaw = lines.reduce((s, l) => s + l.price, 0);
  const hasAnyDiscount = discount > 0 || Object.values(itemDiscounts).some(v => v > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-soft overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="gradient-header w-full px-8 py-5 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary-foreground" />
          <h2 className="text-xl font-extrabold text-primary-foreground">СТОИМОСТЬ</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {hasAnyDiscount && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-primary-foreground/60 line-through block"
              >
                {formatPrice(totalRaw)}
              </motion.span>
            )}
            <motion.span
              key={discountedTotal}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-extrabold text-primary-foreground"
            >
              {formatPrice(discountedTotal)}
            </motion.span>
          </div>
          <ChevronDown className={`w-5 h-5 text-primary-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-border">
              {lines.map((line, i) => {
                const itemDisc = itemDiscounts[line.key] || 0;
                const discPrice = line.price * (1 - itemDisc / 100);
                return (
                  <motion.div
                    key={line.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-8 py-3 gap-2"
                  >
                    <span className="text-sm font-medium text-foreground flex-1">{line.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-20">
                        <NumericInput
                          value={itemDisc}
                          onChange={(v) => setItemDiscount(line.key, v)}
                          unit="%"
                          className="h-7 bg-muted border border-border rounded-lg text-xs text-right font-bold pr-6"
                        />
                      </div>
                      <span className="text-sm font-bold text-primary min-w-[100px] text-right">
                        {line.price > 0 ? (
                          itemDisc > 0 ? (
                            <span>
                              <span className="line-through text-muted-foreground text-xs mr-1">{formatPrice(line.price)}</span>
                              {formatPrice(discPrice)}
                            </span>
                          ) : formatPrice(line.price)
                        ) : "—"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Global discount row */}
              <div className="flex items-center justify-between px-8 py-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-foreground">Общая скидка</span>
                </div>
                <div className="flex items-center gap-1 w-24">
                  <NumericInput
                    value={discount}
                    onChange={(v) => setDiscount(Math.min(100, Math.max(0, v)))}
                    unit="%"
                    className="h-8 bg-card border border-border rounded-lg text-sm text-right font-bold pr-8"
                  />
                </div>
              </div>

              {/* Discounted total */}
              {hasAnyDiscount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between px-8 py-4 bg-accent/10"
                >
                  <span className="text-sm font-extrabold text-foreground">Цена со скидкой</span>
                  <span className="text-lg font-extrabold text-accent">
                    {formatPrice(discountedTotal)}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CostSummary;
