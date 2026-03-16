import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ProductSelection from "@/components/calculator/ProductSelection";
import DimensionsForm from "@/components/calculator/DimensionsForm";
import MetalForm from "@/components/calculator/MetalForm";
import AdditionalOptions from "@/components/calculator/AdditionalOptions";
import CostSummary from "@/components/calculator/CostSummary";
import { Link } from "react-router-dom";
import { Settings, FileDown, Building2, MessageSquare, History, Cylinder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateCommercialPdf } from "@/utils/generatePdf";
import { toast } from "@/hooks/use-toast";
import { saveToHistory } from "@/pages/History";
import { motion } from "framer-motion";
import {
  calcCapPrice, calcBoxPrice, calcFlashingPrice, calcAddonPrice,
  capModels, boxModels, flashingModels, addonOptions, formatPrice,
} from "@/data/calculatorData";

import type { CompanyInfo } from "@/utils/generatePdf";

const Calculator = () => {
  const calc = useCalculator();
  const { comment, setComment } = calc;
  const [pdfLoading, setPdfLoading] = useState(false);
  const [company, setCompany] = useState<CompanyInfo>({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  const computeTotal = () => {
    const { dimensionX: X, dimensionY: Y, dimensionH: H,
      metalPrice, meshPrice, stainlessPrice, zincPrice065,
      capModel, boxModel, flashingModel, selectedAddons, discount, itemDiscounts } = calc;
    let total = 0;
    const addItem = (key: string, price: number) => {
      const d = itemDiscounts[key] || 0;
      total += price * (1 - d / 100);
    };
    if (capModel !== "custom") addItem("cap", calcCapPrice(capModel, X, Y, metalPrice));
    if (boxModel !== "none") addItem("box", calcBoxPrice(boxModel, X, Y, H, metalPrice));
    if (flashingModel !== "none") addItem("flashing", calcFlashingPrice(flashingModel, X, Y, metalPrice));
    selectedAddons.forEach(id => {
      addItem(`addon_${id}`, calcAddonPrice(id, capModel, X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065));
    });
    return Math.round(total * (1 - discount / 100));
  };

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const pdfData = {
        dimensionX: calc.dimensionX,
        dimensionY: calc.dimensionY,
        dimensionH: calc.dimensionH,
        roofAngle: calc.roofAngle,
        metalCoating: calc.metalCoating,
        metalColor: calc.metalColor,
        metalPrice: calc.metalPrice,
        meshPrice: calc.meshPrice,
        stainlessPrice: calc.stainlessPrice,
        zincPrice065: calc.zincPrice065,
        capModel: calc.capModel,
        boxModel: calc.boxModel,
        flashingModel: calc.flashingModel,
        selectedAddons: calc.selectedAddons,
        discount: calc.discount,
        itemDiscounts: calc.itemDiscounts,
        comment: calc.comment,
        company,
        companyDefaults: calc.companyDefaults,
      };
      await generateCommercialPdf(pdfData);

      const total = computeTotal();
      const names: string[] = [];
      const capInfo = capModels.find(c => c.id === calc.capModel);
      if (capInfo) names.push(capInfo.name);
      const boxInfo = boxModels.find(b => b.id === calc.boxModel);
      if (boxInfo && calc.boxModel !== "none") names.push(boxInfo.name);
      const flashInfo = flashingModels.find(f => f.id === calc.flashingModel);
      if (flashInfo && calc.flashingModel !== "none") names.push(flashInfo.name);

      saveToHistory({
        id: Date.now().toString(),
        date: new Date().toLocaleString("ru-RU"),
        companyName: company.companyName,
        contactPerson: company.contactPerson,
        totalPrice: total,
        selectedProductNames: names,
        pdfData,
      });

      toast({ title: "PDF сохранён" });
    } catch {
      toast({ title: "Ошибка генерации PDF", variant: "destructive" });
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-header"
      >
        <div className="container max-w-5xl py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Cylinder className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary-foreground">
                  Калькулятор системы PIPE
                </h1>
                <p className="text-xs text-primary-foreground/50 font-medium">Расчёт стоимости изделий</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/history"
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-white/10 rounded-full px-4 py-2"
              >
                <History className="w-4 h-4" />
                История
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-white/10 rounded-full px-4 py-2"
              >
                <Settings className="w-4 h-4" />
                Настройки
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container max-w-5xl py-8 space-y-6">
        {/* Dimensions + Metal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="card-soft p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DimensionsForm />
            <MetalForm />
          </div>
        </motion.div>

        {/* Product Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="card-soft p-8"
        >
          <ProductSelection />
        </motion.div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="card-soft p-8"
        >
          <AdditionalOptions />
        </motion.div>

        {/* Comment field removed */}

        {/* Cost Summary */}
        <CostSummary />

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-soft p-8 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Данные для КП</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Название компании" value={company.companyName}
              onChange={(e) => setCompany(c => ({ ...c, companyName: e.target.value }))}
              className="bg-muted border-0 rounded-xl" />
            <Input placeholder="Контактное лицо" value={company.contactPerson}
              onChange={(e) => setCompany(c => ({ ...c, contactPerson: e.target.value }))}
              className="bg-muted border-0 rounded-xl" />
            <Input placeholder="Телефон" type="tel" value={company.phone}
              onChange={(e) => setCompany(c => ({ ...c, phone: e.target.value }))}
              className="bg-muted border-0 rounded-xl" />
            <Input placeholder="Email" type="email" value={company.email}
              onChange={(e) => setCompany(c => ({ ...c, email: e.target.value }))}
              className="bg-muted border-0 rounded-xl" />
          </div>
        </motion.div>

        {/* PDF Export */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 }}
          className="flex justify-center pb-8"
        >
          <Button
            onClick={handleExportPdf}
            disabled={pdfLoading}
            className="gradient-accent text-accent-foreground hover:opacity-90 py-7 px-10 text-lg font-extrabold rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <FileDown className="w-5 h-5 mr-2" />
            {pdfLoading ? "Генерация..." : "СКАЧАТЬ КП (PDF)"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Calculator;
