"use client";

import { useState } from "react";
import { Copy, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };
type HSV = { h: number; s: number; v: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();

const parseHex = (input: string): RGB | null => {
  const cleaned = input.trim().replace(/^#/, "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cleaned)) return null;
  const hex =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const parseNumbers = (input: string) =>
  input
    .replace(/[^\d.\-.,\s]/g, " ")
    .split(/[,\s]+/)
    .filter(Boolean)
    .map(Number);

const parseRgb = (input: string): RGB | null => {
  const nums = parseNumbers(input);
  if (nums.length < 3) return null;
  const [r, g, b] = nums;
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
  };
};

const parseHsl = (input: string): HSL | null => {
  const nums = parseNumbers(input);
  if (nums.length < 3) return null;
  const [h, s, l] = nums;
  if ([h, s, l].some((v) => Number.isNaN(v))) return null;
  return {
    h: ((h % 360) + 360) % 360,
    s: clamp(s, 0, 100),
    l: clamp(l, 0, 100),
  };
};

const parseHsv = (input: string): HSV | null => {
  const nums = parseNumbers(input);
  if (nums.length < 3) return null;
  const [h, s, v] = nums;
  if ([h, s, v].some((val) => Number.isNaN(val))) return null;
  return {
    h: ((h % 360) + 360) % 360,
    s: clamp(s, 0, 100),
    v: clamp(v, 0, 100),
  };
};

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return {
    h: ((h % 360) + 360) % 360,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const rgbToHsv = ({ r, g, b }: RGB): HSV => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : delta / max;
  return {
    h: ((h % 360) + 360) % 360,
    s: Math.round(s * 100),
    v: Math.round(max * 100),
  };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  const sN = clamp(s, 0, 100) / 100;
  const lN = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (h < 60) {
    r1 = c;
    g1 = x;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
  } else if (h < 180) {
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
};

const hsvToRgb = ({ h, s, v }: HSV): RGB => {
  const sN = clamp(s, 0, 100) / 100;
  const vN = clamp(v, 0, 100) / 100;
  const c = vN * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vN - c;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (h < 60) {
    r1 = c;
    g1 = x;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
  } else if (h < 180) {
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
};

const formatRgb = (rgb: RGB) => `${rgb.r}, ${rgb.g}, ${rgb.b}`;
const formatHsl = (hsl: HSL) => `${Math.round(hsl.h)}, ${hsl.s}%, ${hsl.l}%`;
const formatHsv = (hsv: HSV) => `${Math.round(hsv.h)}, ${hsv.s}%, ${hsv.v}%`;

export default function ColorValueConverter() {
  const [activeMode, setActiveMode] = useState<"hex" | "rgb" | "hsl" | "hsv">(
    "hex"
  );
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [hsv, setHsv] = useState("");
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<
    "hex" | "rgb" | "hsl" | "hsv" | null
  >(null);

  const handleConvert = () => {
    let rgbValue: RGB | null = null;

    if (activeMode === "hex") {
      rgbValue = parseHex(hex);
    } else if (activeMode === "rgb") {
      rgbValue = parseRgb(rgb);
    } else if (activeMode === "hsl") {
      const hslValue = parseHsl(hsl);
      rgbValue = hslValue ? hslToRgb(hslValue) : null;
    } else if (activeMode === "hsv") {
      const hsvValue = parseHsv(hsv);
      rgbValue = hsvValue ? hsvToRgb(hsvValue) : null;
    }

    if (!rgbValue) {
      setError("输入格式不正确，请检查数值范围");
      return;
    }

    const nextHex = toHex(rgbValue);
    const nextHsl = rgbToHsl(rgbValue);
    const nextHsv = rgbToHsv(rgbValue);

    setHex(nextHex);
    setRgb(formatRgb(rgbValue));
    setHsl(formatHsl(nextHsl));
    setHsv(formatHsv(nextHsv));
    setError("");
  };

  const handleClear = () => {
    setHex("");
    setRgb("");
    setHsl("");
    setHsv("");
    setError("");
  };

  const handleSwap = (mode: typeof activeMode) => {
    setActiveMode(mode);
    setError("");
  };

  const copyToClipboard = (
    value: string,
    field: "hex" | "rgb" | "hsl" | "hsv"
  ) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => {
      setCopiedField((prev) => (prev === field ? null : prev));
    }, 1500);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">颜色值转换器</h2>
        <p className="text-muted-foreground text-lg">
          HEX / RGB / HSL / HSB(HSV) 互相转换
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => handleSwap("hex")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeMode === "hex"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            HEX 输入
          </button>
          <button
            onClick={() => handleSwap("rgb")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeMode === "rgb"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            RGB 输入
          </button>
          <button
            onClick={() => handleSwap("hsl")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeMode === "hsl"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            HSL 输入
          </button>
          <button
            onClick={() => handleSwap("hsv")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeMode === "hsv"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            HSB/HSV 输入
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              HEX
            </label>
            <div className="flex gap-2">
              <input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#AABBCC 或 #ABC"
                disabled={activeMode !== "hex"}
                className={cn(
                  "flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10",
                  activeMode === "hex"
                    ? "ring-2 ring-blue-500"
                    : "opacity-60 cursor-not-allowed"
                )}
              />
              <button
                onClick={() => copyToClipboard(hex, "hex")}
                disabled={!hex}
                className={cn(
                  "px-3 rounded-xl text-sm transition-colors cursor-pointer",
                  hex
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                {copiedField === "hex" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              RGB
            </label>
            <div className="flex gap-2">
              <input
                value={rgb}
                onChange={(e) => setRgb(e.target.value)}
                placeholder="255, 255, 255"
                disabled={activeMode !== "rgb"}
                className={cn(
                  "flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10",
                  activeMode === "rgb"
                    ? "ring-2 ring-blue-500"
                    : "opacity-60 cursor-not-allowed"
                )}
              />
              <button
                onClick={() => copyToClipboard(rgb, "rgb")}
                disabled={!rgb}
                className={cn(
                  "px-3 rounded-xl text-sm transition-colors cursor-pointer",
                  rgb
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                {copiedField === "rgb" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              HSL
            </label>
            <div className="flex gap-2">
              <input
                value={hsl}
                onChange={(e) => setHsl(e.target.value)}
                placeholder="210, 50%, 60%"
                disabled={activeMode !== "hsl"}
                className={cn(
                  "flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10",
                  activeMode === "hsl"
                    ? "ring-2 ring-blue-500"
                    : "opacity-60 cursor-not-allowed"
                )}
              />
              <button
                onClick={() => copyToClipboard(hsl, "hsl")}
                disabled={!hsl}
                className={cn(
                  "px-3 rounded-xl text-sm transition-colors cursor-pointer",
                  hsl
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                {copiedField === "hsl" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              HSB/HSV
            </label>
            <div className="flex gap-2">
              <input
                value={hsv}
                onChange={(e) => setHsv(e.target.value)}
                placeholder="210, 80%, 90%"
                disabled={activeMode !== "hsv"}
                className={cn(
                  "flex-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10",
                  activeMode === "hsv"
                    ? "ring-2 ring-blue-500"
                    : "opacity-60 cursor-not-allowed"
                )}
              />
              <button
                onClick={() => copyToClipboard(hsv, "hsv")}
                disabled={!hsv}
                className={cn(
                  "px-3 rounded-xl text-sm transition-colors cursor-pointer",
                  hsv
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                {copiedField === "hsv" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleConvert}
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
          >
            转换
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 先选择输入格式，再填写对应值</li>
            <li>• 支持输入带括号的格式，如 rgb(255, 0, 0)</li>
            <li>• HSB 与 HSV 统一按 HSV 计算</li>
          </ul>
        </div>
      </div>
    </>
  );
}
