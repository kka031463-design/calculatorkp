import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  calcCapPrice, calcBoxPrice, calcFlashingPrice, calcAddonPrice,
  capModels, boxModels, flashingModels, addonOptions,
  CapModel, BoxModel, FlashingModel, AddonId,
} from "@/data/calculatorData";
import type { CompanyDefaults } from "@/context/CalculatorContext";
import { getProductImages, defaultCapImages, defaultBoxImages, defaultFlashingImages } from "@/components/calculator/ProductSelection";

function getCustomNames(): Record<string, Record<string, { name: string; description: string }>> {
  try {
    const saved = localStorage.getItem("pipe_custom_names");
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function resolveModelName(type: "cap" | "box" | "flashing", id: string, fallback: string): string {
  const names = getCustomNames();
  const customName = names[type]?.[id]?.name;
  if (customName) return customName;
  try {
    const saved = localStorage.getItem("pipe_custom_models");
    const customModels = saved ? JSON.parse(saved) : {};
    return customModels[type]?.find((m: { id: string; name: string }) => m.id === id)?.name ?? fallback;
  } catch {
    return fallback;
  }
}

function resolveProductImage(type: "cap" | "box" | "flashing", id: string): string {
  const imgs = getProductImages();
  const defaults: Record<string, Record<string, string>> = {
    cap: defaultCapImages,
    box: defaultBoxImages,
    flashing: defaultFlashingImages,
  };
  return imgs[type]?.[id] || defaults[type]?.[id] || "";
}

function getNextDocNumber(): number {
  try {
    const n = parseInt(localStorage.getItem("pipe_doc_counter") || "0", 10);
    const next = n + 1;
    localStorage.setItem("pipe_doc_counter", String(next));
    return next;
  } catch { return 1; }
}

export interface CompanyInfo {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
}

interface PdfData {
  dimensionX: number;
  dimensionY: number;
  dimensionH: number;
  roofAngle: number;
  metalCoating: string;
  metalColor: string;
  metalPrice: number;
  meshPrice: number;
  stainlessPrice: number;
  zincPrice065: number;
  gasClassicPrice?: number;
  gasModernPrice?: number;
  capModel: CapModel;
  boxModel: BoxModel;
  flashingModel: FlashingModel;
  selectedAddons: AddonId[];
  discount: number;
  itemDiscounts?: Record<string, number>;
  customItemPrices?: Record<string, number>;
  comment: string;
  company: CompanyInfo;
  companyDefaults?: CompanyDefaults;
}

export async function generateCommercialPdf(data: PdfData) {
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:794px;background:#fff;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;";

  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

  const { dimensionX: X, dimensionY: Y, dimensionH: H,
    metalPrice, meshPrice, stainlessPrice, zincPrice065,
    capModel, boxModel, flashingModel, selectedAddons } = data;

  interface Row { name: string; price: number; key: string; image?: string }
  const rows: Row[] = [];

  const customItemPrices = data.customItemPrices || {};
  const isBuiltInCap = capModels.some(c => c.id === capModel);
  const isBuiltInBox = boxModels.some(b => b.id === boxModel);
  const isBuiltInFlashing = flashingModels.some(f => f.id === flashingModel);

  if (capModel !== "custom" && isBuiltInCap) {
    const info = capModels.find(c => c.id === capModel);
    const name = resolveModelName("cap", capModel, info?.name ?? "");
    rows.push({ key: "cap", name: `Колпак: ${name}`, price: calcCapPrice(capModel, X, Y, metalPrice), image: resolveProductImage("cap", capModel) });
  } else {
    const name = capModel === "custom" ? "по эскизу" : resolveModelName("cap", capModel, capModel);
    rows.push({ key: "cap", name: `Колпак: ${name}`, price: customItemPrices.cap || 0, image: resolveProductImage("cap", capModel) });
  }

  if (boxModel !== "none" && isBuiltInBox) {
    const info = boxModels.find(b => b.id === boxModel);
    const name = resolveModelName("box", boxModel, info?.name ?? "");
    rows.push({ key: "box", name: `Короб: ${name}`, price: calcBoxPrice(boxModel, X, Y, H, metalPrice), image: resolveProductImage("box", boxModel) });
  } else if (boxModel !== "none") {
    rows.push({ key: "box", name: `Короб: ${resolveModelName("box", boxModel, boxModel)}`, price: customItemPrices.box || 0, image: resolveProductImage("box", boxModel) });
  }

  if (flashingModel !== "none" && isBuiltInFlashing) {
    const info = flashingModels.find(f => f.id === flashingModel);
    const name = resolveModelName("flashing", flashingModel, info?.name ?? "");
    rows.push({ key: "flashing", name: `Оклад: ${name}`, price: calcFlashingPrice(flashingModel, X, Y, metalPrice), image: resolveProductImage("flashing", flashingModel) });
  } else if (flashingModel !== "none") {
    rows.push({ key: "flashing", name: `Оклад: ${resolveModelName("flashing", flashingModel, flashingModel)}`, price: customItemPrices.flashing || 0, image: resolveProductImage("flashing", flashingModel) });
  }

  selectedAddons.forEach(id => {
    const opt = addonOptions.find(a => a.id === id);
    if (opt) {
      rows.push({
        key: `addon_${id}`,
        name: opt.name,
        price: calcAddonPrice(id, capModel, X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065, data.gasClassicPrice, data.gasModernPrice),
      });
    }
  });

  const itemDiscounts = data.itemDiscounts || {};
  const totalPrice = rows.reduce((s, r) => s + r.price, 0);
  const totalItemDiscRub = rows.reduce((s, r) => {
    const d = itemDiscounts[r.key] || 0;
    return s + r.price * d / 100;
  }, 0);
  const afterItemDisc = totalPrice - totalItemDiscRub;
  const globalDiscRub = afterItemDisc * (data.discount || 0) / 100;
  const discountedTotal = afterItemDisc - globalDiscRub;
  const hasDiscount = (data.discount || 0) > 0 || Object.values(itemDiscounts).some(v => v > 0);
  const showDiscCols = hasDiscount;

  const co = data.company;
  const cd = data.companyDefaults;
  const hasClient = co.companyName || co.contactPerson || co.phone || co.email;

  const docNumber = getNextDocNumber();
  const dateStr = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const diagramUrl = window.location.origin + "/calculator/measurement-diagram.jpg";
  const rowImages = rows.filter(r => r.image);
  const supplierDetails = cd ? [
    cd.companyName,
    cd.inn ? `ИНН ${cd.inn}` : "",
    cd.address,
    cd.phone,
    cd.email,
    cd.website,
  ].filter(Boolean) : [];

  const brd = "#cccccc";
  const brdLight = "#e8e8e8";

  container.innerHTML = `
    <div class="pdf-page" style="width:794px;min-height:1123px;box-sizing:border-box;padding:32px 48px 24px;background:#fff;">

      <!-- HEADER: logo box | title | number/date -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;">

        <!-- Logo box -->
        <div style="padding:10px 14px;min-width:160px;min-height:82px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${cd?.logoDataUrl
            ? `<img src="${cd.logoDataUrl}" style="max-height:70px;max-width:150px;object-fit:contain;" />`
            : `<div style="font-size:11px;color:#aaa;">Логотип</div>`}
        </div>

        <!-- Title -->
        <div style="flex:1;text-align:center;padding:10px 24px 0;">
          <div style="font-size:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</div>
          ${hasClient && co.companyName ? `<div style="font-size:11px;color:#555;margin-top:8px;">Для: <b>${co.companyName}</b>${co.contactPerson ? ` · ${co.contactPerson}` : ""}${co.phone ? ` · ${co.phone}` : ""}</div>` : ""}
        </div>

        <!-- Number + date -->
        <div style="text-align:right;padding-top:4px;min-width:110px;flex-shrink:0;">
          <div style="font-weight:700;font-size:14px;">№ ${docNumber}</div>
          <div style="font-size:12px;color:#555;margin-top:3px;">${dateStr}</div>
        </div>
      </div>

      <!-- Horizontal rule -->
      <div style="border-top:1.5px solid #1a1a1a;margin-bottom:20px;"></div>

      ${supplierDetails.length > 0 ? `
      <div style="font-size:10px;color:#555;line-height:1.55;margin:-8px 0 18px;text-align:right;">
        ${supplierDetails.map(item => `<div>${item}</div>`).join("")}
      </div>` : ""}

      <!-- ПАРАМЕТРЫ ИЗДЕЛИЯ -->
      <div style="margin-bottom:22px;">
        <div style="font-size:13px;font-weight:700;border-bottom:1px solid ${brd};padding-bottom:5px;margin-bottom:14px;">Параметры изделия</div>
        <div style="display:flex;gap:20px;align-items:flex-start;">
          <!-- Left: parameter table -->
          <table style="font-size:12px;border-collapse:collapse;line-height:1.9;flex:1;">
            <tr>
              <td style="color:#555;width:200px;">Размеры (X × Y × H)</td>
              <td style="font-weight:700;">${X} × ${Y} × ${H} мм</td>
            </tr>
            <tr>
              <td style="color:#555;">Угол кровли</td>
              <td style="font-weight:700;">${data.roofAngle}°</td>
            </tr>
            <tr>
              <td style="color:#555;">Цвет</td>
              <td style="font-weight:700;">${data.metalColor}</td>
            </tr>
            <tr>
              <td style="color:#555;">Покрытие</td>
              <td style="font-weight:700;">${data.metalCoating}</td>
            </tr>
          </table>

          <!-- Right: dimension labels + diagram -->
          <div style="display:flex;align-items:center;gap:16px;flex-shrink:0;">
            <div style="font-size:13px;font-weight:600;line-height:2.2;color:#1a1a1a;">
              <div>X – ${X} мм</div>
              <div>Y – ${Y} мм</div>
              <div>H – ${H} мм</div>
            </div>
            <img src="${diagramUrl}" crossorigin="anonymous"
              style="height:110px;width:auto;object-fit:contain;" />
          </div>
        </div>
      </div>

      <!-- СПЕЦИФИКАЦИЯ -->
      <div style="margin-bottom:22px;">
        <div style="font-size:13px;font-weight:700;border-bottom:1px solid ${brd};padding-bottom:5px;margin-bottom:14px;">Спецификация</div>
        <table style="width:100%;font-size:12px;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1.5px solid #999;">
              <th style="text-align:left;padding:7px 8px;font-weight:700;width:28px;">№</th>
              <th style="text-align:left;padding:7px 8px;font-weight:700;">Наименование</th>
              ${showDiscCols ? `
              <th style="text-align:right;padding:7px 8px;font-weight:700;width:100px;">Цена</th>
              <th style="text-align:right;padding:7px 8px;font-weight:700;width:90px;">Скидка</th>` : ""}
              <th style="text-align:right;padding:7px 8px;font-weight:700;width:110px;">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => {
              const iDisc = itemDiscounts[r.key] || 0;
              const discRub = r.price * iDisc / 100;
              const sum = r.price - discRub;
              return `
              <tr style="border-bottom:1px solid ${brdLight};">
                <td style="padding:8px 8px;">${i + 1}</td>
                <td style="padding:8px 8px;font-weight:600;">${r.name}</td>
                ${showDiscCols ? `
                <td style="padding:8px 8px;text-align:right;color:#555;">${r.price > 0 ? fmt(r.price) : "—"}</td>
                <td style="padding:8px 8px;text-align:right;color:#555;">${discRub > 0 ? `−${fmt(discRub)}` : "—"}</td>` : ""}
                <td style="padding:8px 8px;text-align:right;font-weight:600;">${r.price > 0 ? fmt(showDiscCols ? sum : r.price) : "—"}</td>
              </tr>`;
            }).join("")}
          </tbody>
          <tfoot>
            ${showDiscCols && totalItemDiscRub > 0 && (data.discount || 0) === 0 ? "" : ""}
            ${showDiscCols && (data.discount || 0) > 0 ? `
            <tr style="border-top:1px solid ${brd};">
              <td colspan="${showDiscCols ? 4 : 2}" style="padding:6px 8px;text-align:right;color:#555;font-size:11px;">Общая скидка ${data.discount}%:</td>
              <td style="padding:6px 8px;text-align:right;color:#555;font-size:11px;">−${fmt(globalDiscRub)}</td>
            </tr>` : ""}
            <tr style="border-top:1.5px solid #999;">
              <td colspan="${showDiscCols ? 4 : 2}" style="padding:9px 8px;text-align:right;font-weight:700;font-size:13px;">ИТОГО:</td>
              <td style="padding:9px 8px;text-align:right;font-weight:700;font-size:14px;">${fmt(hasDiscount ? discountedTotal : totalPrice)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      ${data.comment ? `
      <div style="margin-bottom:16px;padding:10px 14px;border-left:2px solid #999;background:#f9f9f9;">
        <div style="font-size:11px;color:#333;line-height:1.6;">${data.comment}</div>
      </div>` : ""}

      <!-- FOOTER -->
      <div style="border-top:1px solid ${brd};padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end;">
        <div style="font-size:9px;color:#888;line-height:1.7;">
          Данное коммерческое предложение носит информационный характер<br>и не является публичной офертой.
        </div>
        ${cd && (cd.phone || cd.email) ? `
        <div style="text-align:right;font-size:10px;color:#555;">
          ${cd.phone ? `<div>${cd.phone}</div>` : ""}
          ${cd.email ? `<div>${cd.email}</div>` : ""}
        </div>` : ""}
      </div>

    </div>

    ${rowImages.length > 0 ? `
    <div class="pdf-page" style="width:794px;min-height:1123px;box-sizing:border-box;padding:32px 48px 24px;background:#fff;">
      <div style="font-size:13px;font-weight:700;border-bottom:1px solid ${brd};padding-bottom:5px;margin-bottom:18px;">Внешний вид изделий</div>
      <div style="display:grid;grid-template-columns:1fr;gap:18px;">
        ${rowImages.map(r => `
        <div style="break-inside:avoid;page-break-inside:avoid;">
          <div style="border:1px solid ${brd};padding:14px;text-align:center;border-radius:3px;height:260px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">
            <img src="${r.image}" style="max-width:100%;max-height:230px;object-fit:contain;" />
          </div>
          <div style="text-align:center;font-size:11px;font-weight:700;padding:7px 0;">${r.name}</div>
        </div>`).join("")}
      </div>
    </div>` : ""}
  `;

  document.body.appendChild(container);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 200));

  const pdf = new jsPDF("p", "mm", "a4");
  const pages = Array.from(container.querySelectorAll<HTMLElement>(".pdf-page"));
  for (let i = 0; i < pages.length; i += 1) {
    const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, allowTaint: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, Math.min(imgHeight, 277));
  }
  document.body.removeChild(container);

  pdf.save(`КП_${docNumber}_${new Date().toLocaleDateString("ru-RU").replace(/\./g, "-")}.pdf`);
}
