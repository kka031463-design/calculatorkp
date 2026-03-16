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
  return names[type]?.[id]?.name ?? fallback;
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
  capModel: CapModel;
  boxModel: BoxModel;
  flashingModel: FlashingModel;
  selectedAddons: AddonId[];
  discount: number;
  itemDiscounts?: Record<string, number>;
  comment: string;
  company: CompanyInfo;
  companyDefaults?: CompanyDefaults;
}

export async function generateCommercialPdf(data: PdfData) {
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:800px;background:#fff;color:#222;";

  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

  const { dimensionX: X, dimensionY: Y, dimensionH: H,
    metalPrice, meshPrice, stainlessPrice, zincPrice065,
    capModel, boxModel, flashingModel, selectedAddons } = data;

  interface Row { name: string; price: number; key: string; image?: string }
  const rows: Row[] = [];

  if (capModel !== "custom") {
    const info = capModels.find(c => c.id === capModel);
    const name = resolveModelName("cap", capModel, info?.name ?? "");
    rows.push({ key: "cap", name: `Колпак: ${name}`, price: calcCapPrice(capModel, X, Y, metalPrice), image: resolveProductImage("cap", capModel) });
  } else {
    rows.push({ key: "cap", name: "Колпак: по эскизу", price: 0 });
  }

  if (boxModel !== "none") {
    const info = boxModels.find(b => b.id === boxModel);
    const name = resolveModelName("box", boxModel, info?.name ?? "");
    rows.push({ key: "box", name: `Короб: ${name}`, price: calcBoxPrice(boxModel, X, Y, H, metalPrice), image: resolveProductImage("box", boxModel) });
  }

  if (flashingModel !== "none") {
    const info = flashingModels.find(f => f.id === flashingModel);
    const name = resolveModelName("flashing", flashingModel, info?.name ?? "");
    rows.push({ key: "flashing", name: `Оклад: ${name}`, price: calcFlashingPrice(flashingModel, X, Y, metalPrice), image: resolveProductImage("flashing", flashingModel) });
  }

  selectedAddons.forEach(id => {
    const opt = addonOptions.find(a => a.id === id);
    if (opt) {
      rows.push({
        key: `addon_${id}`,
        name: opt.name,
        price: calcAddonPrice(id, capModel, X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065),
      });
    }
  });

  const itemDiscounts = data.itemDiscounts || {};
  const totalAfterItemDiscounts = rows.reduce((s, r) => {
    const d = itemDiscounts[(r as any).key] || 0;
    return s + r.price * (1 - d / 100);
  }, 0);
  const total = rows.reduce((s, r) => s + r.price, 0);
  const discountedTotal = totalAfterItemDiscounts * (1 - (data.discount || 0) / 100);
  const hasDiscount = (data.discount || 0) > 0 || Object.values(itemDiscounts).some(v => v > 0);
  const co = data.company;
  const cd = data.companyDefaults;
  const hasOurCompany = cd && (cd.companyName || cd.phone || cd.email);
  const hasClient = co.companyName || co.contactPerson || co.phone || co.email;
  const dateStr = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const accentDark = "#5C1A1A";
  const accentMid = "#8B2525";
  const accentLight = "#F9F2F2";
  const borderColor = "#E8D5D5";

  container.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <div style="font-family:'Source Sans 3',sans-serif;padding:0;">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg, ${accentDark} 0%, ${accentMid} 100%);padding:32px 40px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:20px;">
          ${cd?.logoDataUrl ? `<img src="${cd.logoDataUrl}" style="height:50px;max-width:140px;object-fit:contain;border-radius:4px;" />` : ""}
          <div>
            <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">
              КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
            </div>
            ${hasOurCompany ? `<div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px;">${cd!.companyName}</div>` : ""}
          </div>
        </div>
        <div style="text-align:right;color:rgba(255,255,255,0.8);font-size:12px;">
          <div style="font-weight:600;color:#fff;font-size:13px;">№ ${Date.now().toString().slice(-6)}</div>
          <div style="margin-top:2px;">${dateStr}</div>
        </div>
      </div>

      <div style="padding:32px 40px;">

        <!-- OUR COMPANY + CLIENT -->
        <div style="display:flex;gap:24px;margin-bottom:28px;">
          ${hasOurCompany ? `
          <div style="flex:1;background:${accentLight};border:1px solid ${borderColor};border-radius:8px;padding:16px 20px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${accentMid};font-weight:600;margin-bottom:8px;">Поставщик</div>
            ${cd!.companyName ? `<div style="font-weight:700;font-size:14px;color:${accentDark};margin-bottom:4px;">${cd!.companyName}</div>` : ""}
            ${cd!.inn ? `<div style="font-size:12px;color:#666;">ИНН: ${cd!.inn}</div>` : ""}
            ${cd!.address ? `<div style="font-size:12px;color:#666;">${cd!.address}</div>` : ""}
            ${cd!.phone ? `<div style="font-size:12px;color:#666;">Тел: ${cd!.phone}</div>` : ""}
            ${cd!.email ? `<div style="font-size:12px;color:#666;">${cd!.email}</div>` : ""}
            ${cd!.website ? `<div style="font-size:12px;color:${accentMid};">${cd!.website}</div>` : ""}
          </div>` : ""}
          ${hasClient ? `
          <div style="flex:1;background:#FAFAFA;border:1px solid #E5E5E5;border-radius:8px;padding:16px 20px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#888;font-weight:600;margin-bottom:8px;">Заказчик</div>
            ${co.companyName ? `<div style="font-weight:700;font-size:14px;color:#222;margin-bottom:4px;">${co.companyName}</div>` : ""}
            ${co.contactPerson ? `<div style="font-size:12px;color:#666;">Контактное лицо: ${co.contactPerson}</div>` : ""}
            ${co.phone ? `<div style="font-size:12px;color:#666;">Тел: ${co.phone}</div>` : ""}
            ${co.email ? `<div style="font-size:12px;color:#666;">Email: ${co.email}</div>` : ""}
          </div>` : ""}
        </div>

        <!-- PARAMETERS -->
        <div style="margin-bottom:28px;">
          <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:${accentDark};border-bottom:2px solid ${borderColor};padding-bottom:6px;margin-bottom:14px;">
            Параметры изделия
          </div>
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr>
              <td style="padding:5px 0;color:#888;width:200px;">Размеры (X × Y × H)</td>
              <td style="padding:5px 0;font-weight:600;">${X} × ${Y} × ${H} мм</td>
              <td style="padding:5px 0;color:#888;width:160px;">Угол кровли</td>
              <td style="padding:5px 0;font-weight:600;">${data.roofAngle}°</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#888;">Покрытие</td>
              <td style="padding:5px 0;font-weight:600;">${data.metalCoating}</td>
              <td style="padding:5px 0;color:#888;">Цвет</td>
              <td style="padding:5px 0;font-weight:600;">${data.metalColor}</td>
            </tr>
          </table>
        </div>

        <!-- TABLE -->
        <div style="margin-bottom:24px;">
          <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:${accentDark};border-bottom:2px solid ${borderColor};padding-bottom:6px;margin-bottom:14px;">
            Спецификация
          </div>
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <thead>
              <tr style="background:${accentLight};">
                <th style="text-align:left;padding:10px 12px;border-bottom:2px solid ${borderColor};color:${accentDark};font-weight:600;width:36px;">№</th>
                <th style="text-align:left;padding:10px 12px;border-bottom:2px solid ${borderColor};color:${accentDark};font-weight:600;">Наименование</th>
                <th style="text-align:right;padding:10px 12px;border-bottom:2px solid ${borderColor};color:${accentDark};font-weight:600;width:80px;">Скидка</th>
                <th style="text-align:right;padding:10px 12px;border-bottom:2px solid ${borderColor};color:${accentDark};font-weight:600;width:140px;">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((r, i) => {
                const iDisc = itemDiscounts[r.key] || 0;
                const discPrice = r.price * (1 - iDisc / 100);
                const imgHtml = r.image ? `<img src="${r.image}" style="width:40px;height:40px;object-fit:contain;border-radius:4px;border:1px solid #EEE;background:#fafafa;flex-shrink:0;" />` : `<div style="width:40px;height:40px;flex-shrink:0;"></div>`;
                return `
                <tr style="${i % 2 === 1 ? `background:${accentLight};` : ""}">
                  <td style="padding:10px 12px;border-bottom:1px solid #EEE;color:#888;">${i + 1}</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #EEE;font-weight:500;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      ${imgHtml}
                      <span>${r.name}</span>
                    </div>
                  </td>
                  <td style="padding:10px 12px;border-bottom:1px solid #EEE;text-align:right;color:#888;">${iDisc > 0 ? `${iDisc}%` : "—"}</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #EEE;text-align:right;font-weight:600;">${r.price > 0 ? (iDisc > 0 ? `<span style="text-decoration:line-through;color:#aaa;font-size:11px;">${fmt(r.price)}</span><br>${fmt(discPrice)}` : fmt(r.price)) : "—"}</td>
                </tr>`;
              }).join("")}


              <tr style="background:${accentLight};">
                <td colspan="3" style="padding:12px;text-align:right;font-weight:700;font-size:14px;color:${accentDark};border-top:2px solid ${borderColor};">ИТОГО:</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;color:${accentDark};border-top:2px solid ${borderColor};">${fmt(totalAfterItemDiscounts)}</td>
              </tr>
              ${hasDiscount ? `
              ${(data.discount || 0) > 0 ? `<tr>
                <td colspan="3" style="padding:8px 12px;text-align:right;color:#888;font-size:13px;">Общая скидка ${data.discount}%</td>
                <td style="padding:8px 12px;text-align:right;color:#888;font-size:13px;">−${fmt(totalAfterItemDiscounts - discountedTotal)}</td>
              </tr>` : ""}
              <tr style="background:linear-gradient(135deg, ${accentDark}, ${accentMid});">
                <td colspan="3" style="padding:14px 12px;text-align:right;font-weight:700;font-size:15px;color:#fff;border-radius:0 0 0 8px;">ИТОГО СО СКИДКОЙ:</td>
                <td style="padding:14px 12px;text-align:right;font-weight:700;font-size:18px;color:#fff;border-radius:0 0 8px 0;">${fmt(discountedTotal)}</td>
              </tr>` : ""}
            </tbody>
          </table>
        </div>

        ${data.comment ? `
        <div style="background:${accentLight};border-left:3px solid ${accentMid};border-radius:0 6px 6px 0;padding:12px 18px;margin-bottom:24px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${accentMid};font-weight:600;margin-bottom:4px;">Комментарий</div>
          <div style="font-size:13px;color:#444;line-height:1.5;">${data.comment}</div>
        </div>` : ""}

        <!-- FOOTER -->
        <div style="border-top:1px solid #E5E5E5;padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:10px;color:#AAA;line-height:1.6;">
            Данное коммерческое предложение носит информационный характер<br>и не является публичной офертой.
          </div>
          ${hasOurCompany ? `
          <div style="text-align:right;font-size:11px;color:#888;">
            ${cd!.phone ? `<span>${cd!.phone}</span>` : ""}
            ${cd!.email ? `<span style="margin-left:16px;">${cd!.email}</span>` : ""}
          </div>` : ""}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Wait for fonts to load
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 200));

  const canvas = await html2canvas(container, { scale: 1.5, useCORS: true, allowTaint: true });
  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/jpeg", 0.85);
  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pdf = new jsPDF("p", "mm", "a4");
  const pageHeight = 277;
  let position = 10;

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
  } else {
    let remainingHeight = imgHeight;
    while (remainingHeight > 0) {
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        pdf.addPage();
        position = -(imgHeight - remainingHeight);
      }
    }
  }

  pdf.save(`КП_${new Date().toLocaleDateString("ru-RU").replace(/\./g, "-")}.pdf`);
}
