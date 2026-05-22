import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CapModel, BoxModel, FlashingModel, AddonId,
  defaultCoatings, defaultColors, DEFAULT_METAL_PRICE,
} from "@/data/calculatorData";

interface MetalColor { code: string; name: string; }

export interface CompanyDefaults {
  companyName: string;
  inn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoDataUrl: string;
}

const defaultCompanyDefaults: CompanyDefaults = {
  companyName: "ООО «БауМастер»",
  inn: "",
  address: "г. Санкт-Петербург, Выборгское шоссе, 212, выставка «Коттеджи в Озерках», павильон 9с",
  phone: "+7 (812) 313-20-03",
  email: "baumasterspb@mail.ru",
  website: "baumaster.ru",
  logoDataUrl: "/calculator/logo_b.jpg",
};

function withCompanyDefaults(value?: Partial<CompanyDefaults> | null): CompanyDefaults {
  const merged = { ...defaultCompanyDefaults, ...(value || {}) };
  return Object.fromEntries(
    Object.entries(merged).map(([key, val]) => [
      key,
      typeof val === "string" && val.trim() === ""
        ? defaultCompanyDefaults[key as keyof CompanyDefaults]
        : val,
    ])
  ) as CompanyDefaults;
}

export type PriceMatrix = Record<string, Record<string, number>>;

const defaultPriceMatrix: PriceMatrix = {
  "без покрытия 0,45": { "нержавейка": 700, "сетка": 1100 },
  "без покрытия 0,65": { "цинк": 725 },
  "полиэстер": {
    "RAL 7024": 510, "RAL 8017": 510, "RAL 9005": 510,
    "RAL 8019": 530, "RAL 6005": 530, "RAL 7004": 510,
    "RAL 5005": 530, "RAL 3011": 550, "RAL 3005": 550,
    "RR 32": 560,
  },
  "полиэстер текстура": {
    "RAL 7024": 580, "RAL 8017": 580, "RAL 9005": 580,
    "RAL 8019": 600, "RAL 6005": 600, "RAL 7004": 580,
    "RAL 5005": 600, "RAL 3011": 620, "RAL 3005": 620,
    "RR 32": 630,
  },
  "satin": {
    "RAL 7024": 650, "RAL 8017": 650, "RAL 9005": 650,
    "RAL 8019": 670, "RAL 6005": 670, "RAL 7004": 650,
    "RAL 5005": 670, "RAL 3011": 690, "RAL 3005": 690,
    "RR 32": 700,
  },
  "velur": {
    "RAL 7024": 680, "RAL 8017": 680, "RAL 9005": 680,
    "RAL 8019": 700, "RAL 6005": 700, "RAL 7004": 680,
    "RAL 5005": 700, "RAL 3011": 720, "RAL 3005": 720,
    "RR 32": 730,
  },
  "PUR": {
    "RAL 7024": 720, "RAL 8017": 720, "RAL 9005": 720,
    "RAL 8019": 740, "RAL 6005": 740, "RAL 7004": 720,
    "RAL 5005": 740, "RAL 3011": 760, "RAL 3005": 760,
    "RR 32": 770,
  },
  "PUR mat": {
    "RAL 7024": 750, "RAL 8017": 750, "RAL 9005": 750,
    "RAL 8019": 770, "RAL 6005": 770, "RAL 7004": 750,
    "RAL 5005": 770, "RAL 3011": 790, "RAL 3005": 790,
    "RR 32": 800,
  },
  "бархат": {
    "RAL 7024": 780, "RAL 8017": 780, "RAL 9005": 780,
    "RAL 8019": 800, "RAL 6005": 800, "RAL 7004": 780,
    "RAL 5005": 800, "RAL 3011": 820, "RAL 3005": 820,
    "RR 32": 830,
  },
};

// Per-item discounts keyed by item identifier
export type ItemDiscounts = Record<string, number>;
export type CustomItemPrices = Record<string, number>;

interface CalculatorState {
  // Dimensions
  dimensionX: number; setDimensionX: (v: number) => void;
  dimensionY: number; setDimensionY: (v: number) => void;
  dimensionH: number; setDimensionH: (v: number) => void;
  roofAngle: number; setRoofAngle: (v: number) => void;

  // Metal
  metalCoating: string; setMetalCoating: (v: string) => void;
  metalColor: string; setMetalColor: (v: string) => void;
  metalPrice: number; setMetalPrice: (v: number) => void;
  meshPrice: number; setMeshPrice: (v: number) => void;
  stainlessPrice: number; setStainlessPrice: (v: number) => void;
  zincPrice065: number; setZincPrice065: (v: number) => void;
  gasClassicPrice: number; setGasClassicPrice: (v: number) => void;
  gasModernPrice: number; setGasModernPrice: (v: number) => void;

  // Price matrix
  priceMatrix: PriceMatrix; setPriceMatrix: (v: PriceMatrix) => void;
  updateMatrixPrice: (coating: string, color: string, price: number) => void;

  // Products
  capModel: CapModel; setCapModel: (v: CapModel) => void;
  boxModel: BoxModel; setBoxModel: (v: BoxModel) => void;
  flashingModel: FlashingModel; setFlashingModel: (v: FlashingModel) => void;

  // Addons
  selectedAddons: AddonId[]; toggleAddon: (id: AddonId) => void;

  // Discount (global)
  discount: number; setDiscount: (v: number) => void;

  // Per-item discounts
  itemDiscounts: ItemDiscounts; setItemDiscount: (key: string, value: number) => void;
  customItemPrices: CustomItemPrices; setCustomItemPrice: (key: string, value: number) => void;

  // Lists
  coatings: string[]; setCoatings: (v: string[]) => void;
  colors: MetalColor[]; setColors: (v: MetalColor[]) => void;

  // Comment
  comment: string; setComment: (v: string) => void;

  // Company defaults for PDF
  companyDefaults: CompanyDefaults; setCompanyDefaults: (v: CompanyDefaults) => void;

  // Load full state from saved history entry
  loadFromPdfData: (data: any) => void;
}

const CalculatorContext = createContext<CalculatorState | null>(null);

export const useCalculator = () => {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
};

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [dimensionX, setDimensionX] = useState(380);
  const [dimensionY, setDimensionY] = useState(380);
  const [dimensionH, setDimensionH] = useState(500);
  const [roofAngle, setRoofAngle] = useState(30);

  const [metalCoating, setMetalCoating] = useState("полиэстер");
  const [metalColor, setMetalColor] = useState("RAL 7024");
  const [metalPrice, setMetalPrice] = useState(DEFAULT_METAL_PRICE);
  const [meshPrice, setMeshPrice] = useState(1100);
  const [stainlessPrice, setStainlessPrice] = useState(700);
  const [zincPrice065, setZincPrice065] = useState(725);
  const [gasClassicPrice, setGasClassicPriceState] = useState(() => Number(localStorage.getItem("pipe_gas_classic_price")) || 2500);
  const [gasModernPrice, setGasModernPriceState] = useState(() => Number(localStorage.getItem("pipe_gas_modern_price")) || 1800);

  const [priceMatrix, setPriceMatrix] = useState<PriceMatrix>(() => {
    try {
      const saved = localStorage.getItem("pipe_price_matrix");
      return saved ? JSON.parse(saved) : defaultPriceMatrix;
    } catch { return defaultPriceMatrix; }
  });

  const [capModel, setCapModel] = useState<CapModel>("classic_simple");
  const [boxModel, setBoxModel] = useState<BoxModel>("none");
  const [flashingModel, setFlashingModel] = useState<FlashingModel>("none");
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const [discount, setDiscount] = useState(0);
  const [itemDiscounts, setItemDiscounts] = useState<ItemDiscounts>({});
  const [customItemPrices, setCustomItemPrices] = useState<CustomItemPrices>({});

  const [coatings, setCoatings] = useState(defaultCoatings);
  const [colors, setColors] = useState(defaultColors);
  const [comment, setComment] = useState("");

  const [companyDefaults, setCompanyDefaults] = useState<CompanyDefaults>(() => {
    try {
      const saved = localStorage.getItem("pipe_company_defaults");
      return withCompanyDefaults(saved ? JSON.parse(saved) : null);
    } catch { return withCompanyDefaults(); }
  });

  useEffect(() => {
    localStorage.setItem("pipe_company_defaults", JSON.stringify(withCompanyDefaults(companyDefaults)));
  }, [companyDefaults]);

  // On mount: pull shared config from API (overrides localStorage)
  useEffect(() => {
    fetch("/api/config")
      .then(r => r.ok ? r.json() : null)
      .then(remote => {
        if (remote && Object.keys(remote).length > 0) {
          setCompanyDefaults(prev => withCompanyDefaults({ ...prev, ...remote }));
        }
      })
      .catch(() => {});
  }, []);

  const setGasClassicPrice = (value: number) => {
    setGasClassicPriceState(value);
    localStorage.setItem("pipe_gas_classic_price", String(value));
  };

  const setGasModernPrice = (value: number) => {
    setGasModernPriceState(value);
    localStorage.setItem("pipe_gas_modern_price", String(value));
  };

  useEffect(() => {
    const price = priceMatrix[metalCoating]?.[metalColor];
    if (price && price > 0) {
      setMetalPrice(price);
    }
  }, [metalCoating, metalColor, priceMatrix]);

  useEffect(() => {
    localStorage.setItem("pipe_price_matrix", JSON.stringify(priceMatrix));
  }, [priceMatrix]);

  const updateMatrixPrice = (coating: string, color: string, price: number) => {
    setPriceMatrix(prev => ({
      ...prev,
      [coating]: { ...(prev[coating] || {}), [color]: price },
    }));
  };

  const toggleAddon = (id: AddonId) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const setItemDiscount = (key: string, value: number) => {
    setItemDiscounts(prev => ({ ...prev, [key]: Math.min(100, Math.max(0, value)) }));
  };

  const setCustomItemPrice = (key: string, value: number) => {
    setCustomItemPrices(prev => ({ ...prev, [key]: Math.max(0, value || 0) }));
  };

  const loadFromPdfData = (data: any) => {
    if (!data) return;
    if (data.dimensionX !== undefined) setDimensionX(data.dimensionX);
    if (data.dimensionY !== undefined) setDimensionY(data.dimensionY);
    if (data.dimensionH !== undefined) setDimensionH(data.dimensionH);
    if (data.roofAngle !== undefined) setRoofAngle(data.roofAngle);
    if (data.metalCoating) setMetalCoating(data.metalCoating);
    if (data.metalColor) setMetalColor(data.metalColor);
    if (data.metalPrice !== undefined) setMetalPrice(data.metalPrice);
    if (data.meshPrice !== undefined) setMeshPrice(data.meshPrice);
    if (data.stainlessPrice !== undefined) setStainlessPrice(data.stainlessPrice);
    if (data.zincPrice065 !== undefined) setZincPrice065(data.zincPrice065);
    if (data.gasClassicPrice !== undefined) setGasClassicPrice(data.gasClassicPrice);
    if (data.gasModernPrice !== undefined) setGasModernPrice(data.gasModernPrice);
    if (data.capModel) setCapModel(data.capModel);
    if (data.boxModel) setBoxModel(data.boxModel);
    if (data.flashingModel) setFlashingModel(data.flashingModel);
    if (data.selectedAddons) setSelectedAddons(data.selectedAddons);
    if (data.discount !== undefined) setDiscount(data.discount);
    if (data.itemDiscounts) setItemDiscounts(data.itemDiscounts);
    if (data.customItemPrices) setCustomItemPrices(data.customItemPrices);
    if (data.comment !== undefined) setComment(data.comment);
    if (data.company) {
      try { sessionStorage.setItem("pipe_edit_company", JSON.stringify(data.company)); } catch {}
    }
  };

  return (
    <CalculatorContext.Provider value={{
      dimensionX, setDimensionX, dimensionY, setDimensionY,
      dimensionH, setDimensionH, roofAngle, setRoofAngle,
      metalCoating, setMetalCoating, metalColor, setMetalColor,
      metalPrice, setMetalPrice, meshPrice, setMeshPrice,
      stainlessPrice, setStainlessPrice, zincPrice065, setZincPrice065,
      gasClassicPrice, setGasClassicPrice, gasModernPrice, setGasModernPrice,
      priceMatrix, setPriceMatrix, updateMatrixPrice,
      capModel, setCapModel, boxModel, setBoxModel,
      flashingModel, setFlashingModel,
      selectedAddons, toggleAddon,
      discount, setDiscount,
      itemDiscounts, setItemDiscount, customItemPrices, setCustomItemPrice,
      coatings, setCoatings, colors, setColors,
      comment, setComment,
      companyDefaults, setCompanyDefaults,
      loadFromPdfData,
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
