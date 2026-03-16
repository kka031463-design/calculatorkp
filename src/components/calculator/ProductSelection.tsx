import { useCalculator } from "@/context/CalculatorContext";
import { capModels, boxModels, flashingModels, CapModel, BoxModel, FlashingModel } from "@/data/calculatorData";
import { Crown, Box, Layers, Check, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Default images
import capClassicSimpleImg from "@/assets/cap-classic-simple.png";
import capClassicSlattedImg from "@/assets/cap-classic-slatted.png";
import capModernSlattedImg from "@/assets/cap-modern-slatted.png";
import boxLamellarImg from "@/assets/box-lamellar.png";
import flashingProfiledImg from "@/assets/flashing-profiled.png";

export const defaultCapImages: Record<string, string> = {
  classic_simple: capClassicSimpleImg,
  classic_slatted: capClassicSlattedImg,
  modern_simple: "",
  modern_slatted: capModernSlattedImg,
};

export const defaultBoxImages: Record<string, string> = {
  smooth: "",
  lamellar: boxLamellarImg,
};

export const defaultFlashingImages: Record<string, string> = {
  flat: "",
  profiled: flashingProfiledImg,
};

export function getProductImages(): {
  cap: Record<string, string>;
  box: Record<string, string>;
  flashing: Record<string, string>;
} {
  try {
    const saved = localStorage.getItem("pipe_product_images");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        cap: { ...defaultCapImages, ...parsed.cap },
        box: { ...defaultBoxImages, ...parsed.box },
        flashing: { ...defaultFlashingImages, ...parsed.flashing },
      };
    }
  } catch {}
  return { cap: defaultCapImages, box: defaultBoxImages, flashing: defaultFlashingImages };
}

// Load custom models from localStorage
function getCustomModels(): {
  cap: { id: string; name: string; description: string }[];
  box: { id: string; name: string; description: string }[];
  flashing: { id: string; name: string; description: string }[];
} {
  try {
    const saved = localStorage.getItem("pipe_custom_models");
    return saved ? JSON.parse(saved) : { cap: [], box: [], flashing: [] };
  } catch { return { cap: [], box: [], flashing: [] }; }
}

function getCustomNames(): Record<string, Record<string, { name: string; description: string }>> {
  try {
    const saved = localStorage.getItem("pipe_custom_names");
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

export function getHiddenModels(): { cap: string[]; box: string[]; flashing: string[] } {
  try {
    const saved = localStorage.getItem("pipe_hidden_models");
    return saved ? JSON.parse(saved) : { cap: [], box: [], flashing: [] };
  } catch { return { cap: [], box: [], flashing: [] }; }
}

export function saveHiddenModels(hidden: { cap: string[]; box: string[]; flashing: string[] }) {
  localStorage.setItem("pipe_hidden_models", JSON.stringify(hidden));
}

export function getAllModels(type: "cap" | "box" | "flashing") {
  const custom = getCustomModels();
  const customNames = getCustomNames();
  const hidden = getHiddenModels();
  const applyNames = (items: { id: string; name: string; description: string }[]) =>
    items
      .filter(item => !hidden[type].includes(item.id))
      .map(item => {
        const override = customNames[type]?.[item.id];
        return override ? { ...item, name: override.name, description: override.description } : item;
      });

  if (type === "cap") return applyNames([...capModels, ...custom.cap]);
  if (type === "box") return applyNames([...boxModels, ...custom.box]);
  return applyNames([...flashingModels, ...custom.flashing]);
}

type Section<T extends string> = {
  title: string;
  icon: React.ReactNode;
  items: { id: T; name: string; description: string }[];
  value: T;
  onChange: (v: T) => void;
  images?: Record<string, string>;
};

function SelectionGroup<T extends string>({ title, icon, items, value, onChange, images }: Section<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const selected = value === item.id;
          const img = images?.[item.id];
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(item.id)}
              className={`relative text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                selected
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 hover:shadow-md"
              }`}
            >
              {/* Image area */}
              <div className={`aspect-square w-full flex items-center justify-center overflow-hidden ${
                selected ? "bg-primary/5" : "bg-muted/50"
              }`}>
                {img ? (
                  <img
                    src={img}
                    alt={item.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground/50">
                    <ImageOff className="w-8 h-8" />
                    <span className="text-[10px]">В прорисовке</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className={`px-3 py-2.5 border-t transition-colors ${
                selected ? "bg-primary/5 border-primary/20" : "bg-card border-border/50"
              }`}>
                <p className={`text-xs font-bold leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
                  {item.name}
                </p>
              </div>

              {/* Check badge */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                  >
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

const ProductSelection = () => {
  const { capModel, setCapModel, boxModel, setBoxModel, flashingModel, setFlashingModel } = useCalculator();
  const images = getProductImages();
  const allCap = getAllModels("cap");
  const allBox = getAllModels("box");
  const allFlashing = getAllModels("flashing");

  return (
    <div className="space-y-8">
      <SelectionGroup<string>
        title="Модель колпака"
        icon={<Crown className="w-5 h-5 text-primary" />}
        items={allCap}
        value={capModel}
        onChange={(v) => setCapModel(v as CapModel)}
        images={images.cap}
      />
      <SelectionGroup<string>
        title="Модель короба"
        icon={<Box className="w-5 h-5 text-primary" />}
        items={allBox}
        value={boxModel}
        onChange={(v) => setBoxModel(v as BoxModel)}
        images={images.box}
      />
      <SelectionGroup<string>
        title="Тип оклада"
        icon={<Layers className="w-5 h-5 text-primary" />}
        items={allFlashing}
        value={flashingModel}
        onChange={(v) => setFlashingModel(v as FlashingModel)}
        images={images.flashing}
      />
    </div>
  );
};

export default ProductSelection;
