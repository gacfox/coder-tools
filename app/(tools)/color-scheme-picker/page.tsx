"use client";

import { useMemo, useRef, useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const hsbToRgb = (h: number, s: number, b: number) => {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const val = clamp(b, 0, 100) / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = val - c;

  let r = 0;
  let g = 0;
  let bl = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    bl = x;
  } else if (hue < 240) {
    g = x;
    bl = c;
  } else if (hue < 300) {
    r = x;
    bl = c;
  } else {
    r = c;
    bl = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((bl + m) * 255),
  };
};

const toHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();

const buildScheme = (
  baseHue: number,
  mode: string,
  angle: number,
  count: number
) => {
  switch (mode) {
    case "complementary":
      return [baseHue, baseHue + 180];
    case "triadic":
      return [baseHue, baseHue + 120, baseHue + 240];
    case "rectangular":
      return [baseHue, baseHue + 60, baseHue + 180, baseHue + 240];
    case "square":
      return [baseHue, baseHue + 90, baseHue + 180, baseHue + 270];
    case "analogous": {
      const step = clamp(angle, 5, 60);
      const total = clamp(count, 2, 8);
      const start = -Math.floor(total / 2);
      return Array.from({ length: total }, (_, i) => baseHue + (start + i) * step);
    }
    default:
      return [baseHue];
  }
};

export default function ColorSchemePicker() {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(70);
  const [brightness, setBrightness] = useState(90);
  const [scheme, setScheme] = useState("complementary");
  const [analogousAngle, setAnalogousAngle] = useState(20);
  const [analogousCount, setAnalogousCount] = useState(5);
  const [copied, setCopied] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const color = useMemo(
    () => hsbToRgb(hue, saturation, brightness),
    [hue, saturation, brightness]
  );
  const hex = useMemo(() => toHex(color), [color]);

  const schemeHues = useMemo(
    () => buildScheme(hue, scheme, analogousAngle, analogousCount),
    [hue, scheme, analogousAngle, analogousCount]
  );

  const schemeColors = useMemo(
    () =>
      schemeHues.map((h) =>
        toHex(hsbToRgb(((h % 360) + 360) % 360, saturation, brightness))
      ),
    [schemeHues, saturation, brightness]
  );

  const schemeDescription = useMemo(() => {
    switch (scheme) {
      case "complementary":
        return {
          title: "互补色方案",
          text: "对比强烈，适合强调主次关系或引导注意力的界面，如按钮与背景、警示提示等。",
        };
      case "triadic":
        return {
          title: "三色方案",
          text: "色彩均衡且富有活力，适用于品牌配色、插画、数据可视化等需要层次分明的场景。",
        };
      case "rectangular":
        return {
          title: "矩形四色方案",
          text: "包含两组互补色，色彩丰富但需控制主色比例，适合海报、专题页或活动页面。",
        };
      case "square":
        return {
          title: "正方形四色方案",
          text: "四种色相间隔均匀，画面更有节奏感，适合卡片布局或多模块信息展示。",
        };
      case "analogous":
        return {
          title: "相邻色方案",
          text: "色相接近，整体柔和统一，适合背景、插画或需要温和氛围的视觉设计。",
        };
      default:
        return { title: "", text: "" };
    }
  }, [scheme]);

  const updateHueFromEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    if (x === 0 && y === 0) return;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    // conic-gradient starts at top (0deg) and goes clockwise
    const nextHue = (angle + 90 + 360) % 360;
    setHue(Math.round(nextHue));
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    updateHueFromEvent(event);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateHueFromEvent(event);
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setCopiedColor(hex);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const copySchemeHex = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setCopiedColor(value);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const indicatorStyle = useMemo(() => {
    const size = 176;
    const center = size / 2;
    const radius = center - 10;
    const rad = ((hue - 90) * Math.PI) / 180;
    return {
      left: `${radius * Math.cos(rad) + center}px`,
      top: `${radius * Math.sin(rad) + center}px`,
    };
  }, [hue]);

  const schemeIndicatorStyles = useMemo(() => {
    const size = 176;
    const center = size / 2;
    const radius = center - 10;
    return schemeHues.map((schemeHue) => {
      const rad = ((schemeHue - 90) * Math.PI) / 180;
      return {
        left: `${radius * Math.cos(rad) + center}px`,
        top: `${radius * Math.sin(rad) + center}px`,
      };
    });
  }, [schemeHues]);

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">配色方案选择器</h2>
        <p className="text-muted-foreground text-lg">
          基于 HSB 色轮选择颜色与配色方案
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">色相色轮</p>
              <div
                ref={wheelRef}
                className="relative w-44 h-44 rounded-full cursor-pointer select-none"
                style={{
                  background:
                    "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="absolute inset-3 rounded-full bg-background" />
                {schemeIndicatorStyles.map((style, index) => {
                  const schemeHex = schemeColors[index];
                  const isPrimary = schemeHex === hex && index === 0;
                  if (isPrimary) return null;
                  return (
                    <div
                      key={`scheme-dot-${index}`}
                      className="absolute w-4 h-4 rounded-full border-2 border-white/70 bg-transparent shadow"
                      style={{
                        ...style,
                        transform: "translate(-50%, -50%)",
                        boxShadow: `0 0 0 2px ${schemeHex}`,
                      }}
                    />
                  );
                })}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{
                    ...indicatorStyle,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: hex,
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  饱和度: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  明度: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">当前颜色</p>
              <button
                onClick={copyHex}
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 h-28 flex items-center justify-center font-semibold text-lg shadow-inner cursor-pointer"
                style={{ backgroundColor: hex }}
              >
                <span className="px-3 py-1 rounded-full bg-black/50 text-white">
                  {copied && copiedColor === hex ? "已复制" : hex}
                </span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">
                配色方案
              </label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
              >
                <option value="complementary">互补色</option>
                <option value="triadic">三色</option>
                <option value="rectangular">矩形四色</option>
                <option value="square">正方形四色</option>
                <option value="analogous">相邻色（自定义）</option>
              </select>
            </div>

            {scheme === "analogous" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    角度差: {analogousAngle}°
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={analogousAngle}
                    onChange={(e) => setAnalogousAngle(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    数量: {analogousCount}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={analogousCount}
                    onChange={(e) => setAnalogousCount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                配色预览
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {schemeColors.map((colorValue, index) => (
                  <button
                    type="button"
                    key={`${colorValue}-${index}`}
                    onClick={() => copySchemeHex(colorValue)}
                    className="rounded-xl h-16 border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-semibold text-white shadow-inner cursor-pointer"
                    style={{ backgroundColor: colorValue }}
                  >
                    <span className="px-2 py-0.5 rounded-full bg-black/50">
                      {copied && copiedColor === colorValue ? "已复制" : colorValue}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Copy className="w-3 h-3" />
                点击上方主色块可复制十六进制颜色值
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-2">{schemeDescription.title}</h3>
          <p className="text-sm text-muted-foreground">
            {schemeDescription.text}
          </p>
        </div>
      </div>
    </>
  );
}
