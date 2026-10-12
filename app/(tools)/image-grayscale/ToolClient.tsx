"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Palette,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

type GrayscaleAlgorithm = "rec601" | "rec709" | "average" | "max" | "min";

const ALGORITHMS: { id: GrayscaleAlgorithm; label: string; description: string }[] = [
  {
    id: "rec601",
    label: "亮度加权 Rec.601",
    description: "0.299R + 0.587G + 0.114B（默认，最自然）"
  },
  {
    id: "rec709",
    label: "亮度加权 Rec.709",
    description: "0.2126R + 0.7152G + 0.0722B"
  },
  {
    id: "average",
    label: "平均值",
    description: "(R + G + B) / 3"
  },
  {
    id: "max",
    label: "最大值",
    description: "max(R, G, B)"
  },
  {
    id: "min",
    label: "最小值",
    description: "min(R, G, B)"
  }
];

const toGrayscale = (r: number, g: number, b: number, algorithm: GrayscaleAlgorithm) => {
  switch (algorithm) {
    case "rec709":
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    case "average":
      return (r + g + b) / 3;
    case "max":
      return Math.max(r, g, b);
    case "min":
      return Math.min(r, g, b);
    case "rec601":
    default:
      return 0.299 * r + 0.587 * g + 0.114 * b;
  }
};

export default function ImageGrayscale() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [grayscaleSrc, setGrayscaleSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("image");
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [algorithm, setAlgorithm] = useState<GrayscaleAlgorithm>("rec601");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(0.92);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElRef = useRef<HTMLImageElement | null>(null);

  const buildGrayscale = useCallback(
    (img: HTMLImageElement, algo: GrayscaleAlgorithm) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(toGrayscale(data[i], data[i + 1], data[i + 2], algo));
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    },
    []
  );

  // 算法变化时重新计算灰度预览
  useEffect(() => {
    if (!imageElRef.current || !imageSrc) return;
    const result = buildGrayscale(imageElRef.current, algorithm);
    setGrayscaleSrc(result);
  }, [algorithm, imageSrc, buildGrayscale]);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请选择有效的图片文件（如 JPG, PNG, GIF, WebP 等）");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        const maxWidth = 420;
        const maxHeight = 420;
        let displayW = img.width;
        let displayH = img.height;

        if (displayW > maxWidth) {
          const ratio = maxWidth / displayW;
          displayW = maxWidth;
          displayH = img.height * ratio;
        }
        if (displayH > maxHeight) {
          const ratio = maxHeight / displayH;
          displayH = maxHeight;
          displayW = displayW * ratio;
        }

        imageElRef.current = img;
        setImageSrc(src);
        setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
        setOriginalSize({ width: img.width, height: img.height });
        setDisplaySize({ width: Math.round(displayW), height: Math.round(displayH) });
        setGrayscaleSrc(buildGrayscale(img, algorithm));
      };

      img.onerror = () => setError("图片加载失败");
      img.src = src;
    };

    reader.onerror = () => setError("文件读取失败");
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleDownload = () => {
    if (!imageElRef.current || !grayscaleSrc) {
      setError("请先上传图片");
      return;
    }

    const mime = outputFormat === "jpeg" ? "image/jpeg" : "image/png";
    const canvas = document.createElement("canvas");
    canvas.width = imageElRef.current.naturalWidth || imageElRef.current.width;
    canvas.height = imageElRef.current.naturalHeight || imageElRef.current.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("无法创建画布上下文");
      return;
    }

    if (outputFormat === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(imageElRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(toGrayscale(data[i], data[i + 1], data[i + 2], algorithm));
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);

    const link = document.createElement("a");
    link.download = `${fileName}_grayscale.${outputFormat === "jpeg" ? "jpg" : "png"}`;
    link.href = canvas.toDataURL(mime, quality);
    link.click();
  };

  const handleReset = () => {
    imageElRef.current = null;
    setImageSrc(null);
    setGrayscaleSrc(null);
    setFileName("image");
    setOriginalSize({ width: 0, height: 0 });
    setDisplaySize({ width: 0, height: 0 });
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">彩色图片转灰度</h2>
        <p className="text-muted-foreground text-lg">
          将彩色图片转换为灰度（黑白）图片，支持多种灰度算法
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                )}
                onClick={triggerFileInput}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">点击或拖拽图片到此处</p>
                    <p className="text-sm text-muted-foreground">
                      支持 JPG, PNG, GIF, WebP 等格式
                    </p>
                  </div>
                </div>
              </div>

              {imageSrc && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">原图</p>
                      <div className="border border-black/10 dark:border-white/10 rounded-xl p-2 bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <img
                          src={imageSrc}
                          alt="原图"
                          className="rounded-lg object-contain"
                          style={{ width: `${displaySize.width}px`, height: `${displaySize.height}px` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">灰度结果</p>
                      <div className="border border-black/10 dark:border-white/10 rounded-xl p-2 bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        {grayscaleSrc ? (
                          <img
                            src={grayscaleSrc}
                            alt="灰度结果"
                            className="rounded-lg object-contain"
                            style={{ width: `${displaySize.width}px`, height: `${displaySize.height}px` }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center text-xs text-muted-foreground"
                            style={{ width: `${displaySize.width}px`, height: `${displaySize.height}px` }}
                          >
                            生成中...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    原始尺寸: {originalSize.width} × {originalSize.height} px
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={triggerFileInput}
                  className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  选择图片
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  灰度算法
                </h3>
                <div className="space-y-2">
                  {ALGORITHMS.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => setAlgorithm(algo.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border transition-colors",
                        algorithm === algo.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="font-medium text-sm">{algo.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {algo.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  输出设置
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">输出格式</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOutputFormat("png")}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                        outputFormat === "png"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      PNG（无损）
                    </button>
                    <button
                      onClick={() => setOutputFormat("jpeg")}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                        outputFormat === "jpeg"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      JPEG（有损）
                    </button>
                  </div>
                </div>

                {outputFormat === "jpeg" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      质量: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.01"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={!imageSrc}
                className={cn(
                  "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                  imageSrc
                    ? "bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md shadow-green-500/20"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <Download className="w-4 h-4" />
                下载灰度图片
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 点击上传区域、拖拽图片，或点击&quot;选择图片&quot;按钮上传彩色图片</li>
            <li>• 在&quot;灰度算法&quot;中选择转换方式，右侧预览会实时更新</li>
            <li>• 在&quot;输出设置&quot;中选择 PNG 或 JPEG 格式，JPEG 可调整质量</li>
            <li>• 点击&quot;下载灰度图片&quot;保存结果，所有处理均在浏览器本地完成</li>
          </ul>
        </div>
      </div>
    </>
  );
}
