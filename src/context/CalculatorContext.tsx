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
  companyName: "", inn: "", address: "", phone: "", email: "", website: "", logoDataUrl: "",
};

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
  },
};

// Per-item discounts keyed by item identifier
export type ItemDiscounts = Record<string, number>;

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

  // Lists
  coatings: string[]; setCoatings: (v: string[]) => void;
  colors: MetalColor[]; setColors: (v: MetalColor[]) => void;

  // Comment
  comment: string; setComment: (v: string) => void;

  // Company defaults for PDF
  companyDefaults: CompanyDefaults; setCompanyDefaults: (v: CompanyDefaults) => void;
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

  const [coatings, setCoatings] = useState(defaultCoatings);
  const [colors, setColors] = useState(defaultColors);
  const [comment, setComment] = useState("");

  const [companyDefaults, setCompanyDefaults] = useState<CompanyDefaults>(() => {
    try {
      const saved = localStorage.getItem("pipe_company_defaults");
      return saved ? JSON.parse(saved) : defaultCompanyDefaults;
    } catch { return defaultCompanyDefaults; }
  });

  useEffect(() => {
    localStorage.setItem("pipe_company_defaults", JSON.stringify(companyDefaults));
  }, [companyDefaults]);

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

  return (
    <CalculatorContext.Provider value={{
      dimensionX, setDimensionX, dimensionY, setDimensionY,
      dimensionH, setDimensionH, roofAngle, setRoofAngle,
      metalCoating, setMetalCoating, metalColor, setMetalColor,
      metalPrice, setMetalPrice, meshPrice, setMeshPrice,
      stainlessPrice, setStainlessPrice, zincPrice065, setZincPrice065,
      priceMatrix, setPriceMatrix, updateMatrixPrice,
      capModel, setCapModel, boxModel, setBoxModel,
      flashingModel, setFlashingModel,
      selectedAddons, toggleAddon,
      discount, setDiscount,
      itemDiscounts, setItemDiscount,
      coatings, setCoatings, colors, setColors,
      comment, setComment,
      companyDefaults, setCompanyDefaults,
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
