import { useCalculator } from "@/context/CalculatorContext";
import {
  calcCapPrice, calcBoxPrice, calcFlashingPrice, calcAddonPrice,
  capModels, boxModels, flashingModels, addonOptions,
  formatPrice,
} from "@/data/calculatorData";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { NumericInput } from "./DimensionsForm";

interface LineItem {
  key: string;
  name: string;
  price: number;
  customPrice?: boolean;
}

function getCustomModels(): Record<"cap" | "box" | "flashing", { id: string; name: string }[]> {
  try {
    const saved = localStorage.getItem("pipe_custom_models");
    return saved ? JSON.parse(saved) : { cap: [], box: [], flashing: [] };
  } catch {
    return { cap: [], box: [], flashing: [] };
  }
}

function getCustomModelName(type: "cap" | "box" | "flashing", id: string) {
  return getCustomModels()[type]?.find(m => m.id === id)?.name;
}

const CostSummary = () => {
  const calc = useCalculator();
  const { dimensionX: X, dimensionY: Y, dimensionH: H,
    metalPrice, meshPrice, stainlessPrice, zincPrice065,
    capModel, boxModel, flashingModel, selectedAddons,
    discount, setDiscount, itemDiscounts, setItemDiscount,
    customItemPrices, setCustomItemPrice,
    gasClassicPrice, gasModernPrice } = calc;

  const lines: LineItem[] = [];

  if (capModel !== "custom" && capModels.some(c => c.id === capModel)) {
    const capInfo = capModels.find(c => c.id === capModel);
    lines.push({ key: "cap", name: `Колпак: ${capInfo?.name || capModel}`, price: calcCapPrice(capModel, X, Y, metalPrice) });
  } else {
    const name = capModel === "custom" ? "по эскизу (индивидуально)" : getCustomModelName("cap", capModel) || capModel;
    lines.push({ key: "cap", name: `Колпак: ${name}`, price: customItemPrices.cap || 0, customPrice: true });
  }

  if (boxModel !== "none" && boxModels.some(b => b.id === boxModel)) {
    const boxInfo = boxModels.find(b => b.id === boxModel);
    lines.push({ key: "box", name: `Короб: ${boxInfo?.name || boxModel}`, price: calcBoxPrice(boxModel, X, Y, H, metalPrice) });
  } else if (boxModel !== "none") {
    lines.push({ key: "box", name: `Короб: ${getCustomModelName("box", boxModel) || boxModel}`, price: customItemPrices.box || 0, customPrice: true });
  }

  if (flashingModel !== "none" && flashingModels.some(f => f.id === flashingModel)) {
    const flashInfo = flashingModels.find(f => f.id === flashingModel);
    lines.push({ key: "flashing", name: `Оклад: ${flashInfo?.name || flashingModel}`, price: calcFlashingPrice(flashingModel, X, Y, metalPrice) });
  } else if (flashingModel !== "none") {
    lines.push({ key: "flashing", name: `Оклад: ${getCustomModelName("flashing", flashingModel) || flashingModel}`, price: customItemPrices.flashing || 0, customPrice: true });
  }

  selectedAddons.forEach(addonId => {
    const opt = addonOptions.find(a => a.id === addonId);
    if (opt) {
      lines.push({ key: `addon_${addonId}`, name: opt.name, price: calcAddonPrice(addonId, capModel, X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065, gasClassicPrice, gasModernPrice) });
    }
  });

  const totalPrice = lines.reduce((s, l) => s + l.price, 0);
  const totalItemDiscRub = lines.reduce((s, l) => s + l.price * (itemDiscounts[l.key] || 0) / 100, 0);
  const afterItemDisc = totalPrice - totalItemDiscRub;
  const globalDiscRub = afterItemDisc * (discount / 100);
  const finalTotal = afterItemDisc - globalDiscRub;
  const totalDiscRub = totalItemDiscRub + globalDiscRub;

  const hasAnyDiscount = discount > 0 || Object.values(itemDiscounts).some(v => v > 0);
  const displayTotal = finalTotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-soft overflow-hidden"
    >
      {/* Header */}
      <div className="gradient-header px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary-foreground" />
          <h2 className="text-xl font-extrabold text-primary-foreground">СТОИМОСТЬ</h2>
        </div>
        <div className="text-right">
          {hasAnyDiscount && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-primary-foreground/60 line-through block"
            >
              {formatPrice(totalPrice)}
            </motion.span>
          )}
          <motion.span
            key={displayTotal}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-extrabold text-primary-foreground"
          >
            {formatPrice(displayTotal)}
          </motion.span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-10">№</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">Наименование</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Цена, руб.</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Скидка, руб.</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Сумма, руб.</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => {
              const itemDisc = itemDiscounts[line.key] || 0;
              const discRub = line.price * itemDisc / 100;
              const sum = line.price - discRub;
              return (
                <tr
                  key={line.key}
                  className={`border-b border-border transition-colors ${i % 2 === 1 ? "bg-muted/20" : ""} hover:bg-muted/40`}
                >
                  <td className="px-4 py-3 text-muted-foreground font-medium">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{line.name}</td>
                  <td className="px-4 py-3 text-right text-foreground font-semibold">
                    {line.customPrice ? (
                      <div className="ml-auto w-[120px]">
                        <NumericInput
                          value={line.price}
                          onChange={(v) => setCustomItemPrice(line.key, v)}
                          unit="₽"
                          className="h-7 bg-muted border border-border rounded-lg text-xs text-right font-bold pr-8"
                        />
                      </div>
                    ) : line.price > 0 ? formatPrice(line.price) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-[72px]">
                        <NumericInput
                          value={itemDisc}
                          onChange={(v) => setItemDiscount(line.key, v)}
                          unit="%"
                          className="h-7 bg-muted border border-border rounded-lg text-xs text-right font-bold pr-6"
                        />
                      </div>
                      <span className="text-xs text-accent font-semibold min-w-[64px] text-right">
                        {discRub > 0 ? `−${formatPrice(discRub)}` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-primary">
                    {line.price > 0 ? formatPrice(sum) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/40">
              <td colSpan={2} className="px-4 py-4 text-right font-extrabold text-foreground text-base">
                Итого:
              </td>
              <td className="px-4 py-4 text-right font-extrabold text-foreground text-base">
                {formatPrice(totalPrice)}
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-[72px]">
                    <NumericInput
                      value={discount}
                      onChange={(v) => setDiscount(Math.min(100, Math.max(0, v)))}
                      unit="%"
                      className="h-7 bg-card border border-border rounded-lg text-xs text-right font-bold pr-6"
                    />
                  </div>
                  <span className="text-xs text-accent font-semibold min-w-[64px] text-right">
                    {totalDiscRub > 0 ? `−${formatPrice(totalDiscRub)}` : "—"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-right font-extrabold text-foreground text-base">
                {formatPrice(finalTotal)}
              </td>
            </tr>
            {hasAnyDiscount && (
              <tr className="bg-primary/10 border-t border-primary/20">
                <td colSpan={4} className="px-4 py-4 text-right font-extrabold text-foreground text-base">
                  ИТОГО СО СКИДКОЙ:
                </td>
                <td className="px-4 py-4 text-right font-extrabold text-accent text-xl">
                  {formatPrice(finalTotal)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
};

export default CostSummary;
