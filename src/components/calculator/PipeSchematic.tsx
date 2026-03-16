import { motion, AnimatePresence } from "framer-motion";
import { useCalculator } from "@/context/CalculatorContext";
import { useMemo } from "react";

// RAL color mapping to hex
const ralColors: Record<string, string> = {
  "цинк": "#B0B0B0",
  "RAL 7024": "#474B4E",
  "RAL 8017": "#45322E",
  "RAL 9005": "#0A0A0A",
  "RAL 8019": "#403A3A",
  "RAL 6005": "#2F4538",
  "RAL 7004": "#969992",
  "RAL 5005": "#1E3A5F",
  "RAL 3011": "#781F19",
  "RAL 3005": "#5E2129",
  "RR 32": "#3B2820",
  "нержавейка": "#C0C0C8",
};

const lighten = (hex: string, amount: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, r + amount);
  const ng = Math.min(255, g + amount);
  const nb = Math.min(255, b + amount);
  return `rgb(${nr},${ng},${nb})`;
};

const PipeSchematic = () => {
  const {
    dimensionX, dimensionY, dimensionH, roofAngle,
    capModel, boxModel, flashingModel, metalColor,
  } = useCalculator();

  const color = ralColors[metalColor] || "#474B4E";
  const colorLight = lighten(color, 60);
  const colorDark = lighten(color, -20);

  const dims = useMemo(() => {
    const maxDim = Math.max(dimensionX || 380, dimensionY || 380, dimensionH || 500, 100);
    const scale = 130 / maxDim;

    const w = Math.max((dimensionX || 380) * scale, 30);
    const h = Math.max((dimensionH || 500) * scale, 30);
    const d = Math.max((dimensionY || 380) * scale * 0.35, 10);
    const angle = Math.max(5, Math.min(60, roofAngle || 30));
    const roofDrop = Math.tan((angle * Math.PI) / 180) * 140;

    const cx = 160;
    const baseY = 210;
    const topY = baseY - h;

    const left = cx - w / 2;
    const right = cx + w / 2;

    return { w, h, d, cx, baseY, topY, left, right, angle, roofDrop };
  }, [dimensionX, dimensionY, dimensionH, roofAngle]);

  const { w, h, d, cx, baseY, topY, left, right, roofDrop } = dims;

  const spring = { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.8 };
  const capPeakY = topY - 25;

  // Box extends below chimney body
  const boxH = h * 0.15;
  const boxTop = baseY;
  const boxBottom = baseY + boxH;

  // Flashing at roof intersection
  const flashW = w * 0.25;

  const isClassic = capModel.startsWith("classic");
  const isSlatted = capModel.includes("slatted");
  const isCustom = capModel === "custom";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center justify-center"
    >
      <svg
        viewBox="-30 0 380 280"
        className="w-full max-w-[280px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Roof surface */}
        <motion.path
          animate={{ d: `M10 ${baseY + roofDrop * 0.3} L${cx} ${baseY - roofDrop * 0.15} L310 ${baseY + roofDrop * 0.3}` }}
          transition={spring}
          stroke="hsl(220, 30%, 60%)"
          strokeWidth="3"
          fill="hsl(220, 20%, 94%)"
          opacity="0.5"
        />

        {/* === FLASHING === */}
        <AnimatePresence>
          {flashingModel !== "none" && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring}
            >
              {flashingModel === "flat" ? (
                // Flat flashing — horizontal plate
                <motion.rect
                  animate={{
                    x: left - flashW,
                    y: baseY - 3,
                    width: w + flashW * 2,
                    height: 6,
                  }}
                  transition={spring}
                  rx="1"
                  fill={colorLight}
                  stroke={color}
                  strokeWidth="1.5"
                />
              ) : (
                // Profiled flashing — wavy plate
                <motion.g>
                  <motion.rect
                    animate={{
                      x: left - flashW,
                      y: baseY - 4,
                      width: w + flashW * 2,
                      height: 8,
                    }}
                    transition={spring}
                    rx="1"
                    fill={colorLight}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  {/* Wavy lines for profiled look */}
                  {[0.2, 0.4, 0.6, 0.8].map((t) => (
                    <motion.line
                      key={t}
                      animate={{
                        x1: left - flashW + (w + flashW * 2) * t,
                        x2: left - flashW + (w + flashW * 2) * t,
                        y1: baseY - 4,
                        y2: baseY + 4,
                      }}
                      transition={spring}
                      stroke={colorDark}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  ))}
                </motion.g>
              )}
              {/* Flashing label */}
              <motion.text
                animate={{ x: right + flashW + 6, y: baseY + 4 }}
                transition={spring}
                fontSize="9" fill="hsl(220, 50%, 50%)" fontWeight="600" fontFamily="Nunito, sans-serif"
              >
                оклад
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* === BOX === */}
        <AnimatePresence>
          {boxModel !== "none" && (
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={spring}
            >
              <motion.rect
                animate={{
                  x: left - 4,
                  y: topY + h * 0.3,
                  width: w + 8,
                  height: h * 0.7 + boxH,
                }}
                transition={spring}
                rx="2"
                fill={colorLight}
                stroke={color}
                strokeWidth="1.5"
                opacity="0.7"
              />
              {boxModel === "lamellar" && (
                // Lamellar lines
                <>
                  {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t) => (
                    <motion.line
                      key={t}
                      animate={{
                        x1: left - 4,
                        x2: right + 4,
                        y1: topY + h * 0.3 + (h * 0.7 + boxH) * t,
                        y2: topY + h * 0.3 + (h * 0.7 + boxH) * t,
                      }}
                      transition={spring}
                      stroke={colorDark}
                      strokeWidth="0.8"
                      opacity="0.4"
                    />
                  ))}
                </>
              )}
              {/* Box label */}
              <motion.text
                animate={{ x: left - 10, y: baseY + boxH / 2 + 3 }}
                transition={spring}
                fontSize="9" fill="hsl(220, 50%, 50%)" fontWeight="600" fontFamily="Nunito, sans-serif"
                textAnchor="end"
              >
                короб
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* === CHIMNEY BODY === */}
        <motion.rect
          animate={{ x: left, y: topY, width: w, height: h }}
          transition={spring}
          rx="2"
          fill={colorLight}
          stroke={color}
          strokeWidth="2"
        />

        {/* === CAP === */}
        <AnimatePresence mode="wait">
          {isCustom ? (
            <motion.g key="custom"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.text
                animate={{ x: cx, y: topY - 10 }}
                transition={spring}
                textAnchor="middle" fontSize="10" fill="hsl(220, 50%, 50%)" fontWeight="600"
              >?</motion.text>
            </motion.g>
          ) : isClassic ? (
            // Classic cap — triangular with ridge
            <motion.g key="classic"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={spring}
            >
              {/* Main cap shape */}
              <motion.path
                animate={{ d: `M${left - 12} ${topY} L${cx} ${capPeakY} L${right + 12} ${topY} Z` }}
                transition={spring}
                fill={color}
                stroke={colorDark}
                strokeWidth="2"
              />
              {/* Decorative knob on classic */}
              <motion.circle
                animate={{ cx: cx, cy: capPeakY - 6, r: 4 }}
                transition={spring}
                fill={colorLight}
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Side skirts */}
              <motion.line
                animate={{ x1: left - 12, y1: topY, x2: left - 12, y2: topY + 8 }}
                transition={spring} stroke={color} strokeWidth="2"
              />
              <motion.line
                animate={{ x1: right + 12, y1: topY, x2: right + 12, y2: topY + 8 }}
                transition={spring} stroke={color} strokeWidth="2"
              />
              {/* Slatted lines */}
              {isSlatted && [0.25, 0.5, 0.75].map((t) => (
                <motion.line
                  key={t}
                  animate={{
                    x1: left - 12 + (right + 12 - (left - 12)) * t - 3,
                    x2: left - 12 + (right + 12 - (left - 12)) * t + 3,
                    y1: topY - (topY - capPeakY) * t + 2,
                    y2: topY - (topY - capPeakY) * t - 2,
                  }}
                  transition={spring}
                  stroke={colorLight}
                  strokeWidth="1.5"
                  opacity="0.7"
                />
              ))}
            </motion.g>
          ) : (
            // Modern cap — flat/low profile
            <motion.g key="modern"
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              transition={spring}
            >
              {/* Flat top plate */}
              <motion.rect
                animate={{
                  x: left - 8,
                  y: topY - 12,
                  width: w + 16,
                  height: 12,
                }}
                transition={spring}
                rx="2"
                fill={color}
                stroke={colorDark}
                strokeWidth="2"
              />
              {/* Small vent on top */}
              <motion.rect
                animate={{
                  x: cx - 8,
                  y: topY - 20,
                  width: 16,
                  height: 8,
                }}
                transition={spring}
                rx="1"
                fill={colorLight}
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Slatted texture */}
              {isSlatted && [0.2, 0.5, 0.8].map((t) => (
                <motion.line
                  key={t}
                  animate={{
                    x1: left - 8 + (w + 16) * t,
                    x2: left - 8 + (w + 16) * t,
                    y1: topY - 12,
                    y2: topY,
                  }}
                  transition={spring}
                  stroke={colorLight}
                  strokeWidth="1"
                  opacity="0.6"
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* === DIMENSION LABELS === */}
        {/* X */}
        <motion.line
          animate={{ x1: left, x2: right }}
          transition={spring}
          y1="248" y2="248"
          stroke="hsl(38, 75%, 50%)" strokeWidth="2"
          markerEnd="url(#arrowR)" markerStart="url(#arrowL)"
        />
        <motion.text
          animate={{ x: cx }}
          transition={spring}
          y="264" textAnchor="middle" fill="hsl(38, 75%, 45%)"
          fontSize="11" fontWeight="800" fontFamily="Source Sans 3, sans-serif"
        >X = {dimensionX || 380} мм</motion.text>

        {/* Y */}
        <motion.line
          animate={{ x1: right, y1: topY, x2: right + d, y2: topY + d * 0.6 }}
          transition={spring}
          stroke="hsl(0, 72%, 51%)" strokeWidth="2" strokeDasharray="4 2"
        />
        <motion.text
          animate={{ x: right + d + 8, y: topY + d * 0.5 }}
          transition={spring}
          textAnchor="start" fill="hsl(0, 72%, 51%)"
          fontSize="11" fontWeight="800" fontFamily="Source Sans 3, sans-serif"
        >Y = {dimensionY || 380} мм</motion.text>

        {/* H */}
        <motion.line
          animate={{ x1: left - 22, y1: baseY, x2: left - 22, y2: topY }}
          transition={spring}
          stroke="hsl(155, 55%, 38%)" strokeWidth="2"
          markerEnd="url(#arrowU)" markerStart="url(#arrowD)"
        />
        <motion.text
          animate={{ x: left - 32, y: (baseY + topY) / 2 + 5 }}
          transition={spring}
          textAnchor="end" fill="hsl(155, 55%, 38%)"
          fontSize="11" fontWeight="800" fontFamily="Source Sans 3, sans-serif"
        >H = {dimensionH || 500} мм</motion.text>

        {/* α */}
        <motion.path
          animate={{
            d: `M${right + 18} ${baseY} Q ${right + 6} ${baseY - 14}, ${right + 10} ${baseY - 28}`
          }}
          transition={spring}
          stroke="hsl(280, 60%, 50%)" strokeWidth="2" fill="none"
        />
        <motion.text
          animate={{ x: right + 26, y: baseY - 10 }}
          transition={spring}
          textAnchor="start" fill="hsl(280, 60%, 50%)"
          fontSize="11" fontWeight="800" fontFamily="Source Sans 3, sans-serif"
        >α = {roofAngle || 30}°</motion.text>

        {/* Roof dashed line */}
        <motion.line
          animate={{ x1: left, x2: right, y1: baseY, y2: baseY }}
          transition={spring}
          stroke="hsl(220, 65%, 38%)" strokeWidth="1" strokeDasharray="3 3"
        />

        {/* Arrow markers */}
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="hsl(38, 75%, 50%)" />
          </marker>
          <marker id="arrowL" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
            <path d="M8 0 L0 4 L8 8 Z" fill="hsl(38, 75%, 50%)" />
          </marker>
          <marker id="arrowU" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
            <path d="M0 8 L4 0 L8 8 Z" fill="hsl(155, 55%, 38%)" />
          </marker>
          <marker id="arrowD" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M0 0 L4 8 L8 0 Z" fill="hsl(155, 55%, 38%)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
};

export default PipeSchematic;
