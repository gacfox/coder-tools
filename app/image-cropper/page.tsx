"use client";

import { useRef, useState } from "react";
import { Upload, Download, RotateCcw, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

type CropRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeRect = (rect: CropRect) => {
  const x = rect.w < 0 ? rect.x + rect.w : rect.x;
  const y = rect.h < 0 ? rect.y + rect.h : rect.y;
  const w = Math.abs(rect.w);
  const h = Math.abs(rect.h);
  return { x, y, w, h };
};

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("请选择有效的图片文件（如 JPG, PNG, GIF, WebP 等）");
      return;
    }

    setError("");
    setCroppedSrc(null);
    setCropRect(null);

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
          displayH = displayH * ratio;
        }

        if (displayH > maxHeight) {
          const ratio = maxHeight / displayH;
          displayH = maxHeight;
          displayW = displayW * ratio;
        }

        setImageSrc(src);
        setOriginalSize({ width: img.width, height: img.height });
        setDisplaySize({ width: displayW, height: displayH });
      };

      img.onerror = () => setError("图片加载失败");
      img.src = src;
    };

    reader.onerror = () => setError("文件读取失败");
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const startX = clamp(event.clientX - rect.left, 0, rect.width);
    const startY = clamp(event.clientY - rect.top, 0, rect.height);

    setIsDragging(true);
    dragStartRef.current = { x: startX, y: startY };
    setCropRect({ x: startX, y: startY, w: 0, h: 0 });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !imageSrc) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const currentX = clamp(event.clientX - rect.left, 0, rect.width);
    const currentY = clamp(event.clientY - rect.top, 0, rect.height);
    const start = dragStartRef.current;

    setCropRect({ x: start.x, y: start.y, w: currentX - start.x, h: currentY - start.y });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleCrop = () => {
    if (!imageSrc || !cropRect || !imageRef.current) {
      setError("请先上传图片并选择裁剪区域");
      return;
    }

    const normalized = normalizeRect(cropRect);
    if (normalized.w < 4 || normalized.h < 4) {
      setError("裁剪区域过小，请重新选择");
      return;
    }

    const scaleX = originalSize.width / displaySize.width;
    const scaleY = originalSize.height / displaySize.height;

    const sx = Math.round(normalized.x * scaleX);
    const sy = Math.round(normalized.y * scaleY);
    const sw = Math.round(normalized.w * scaleX);
    const sh = Math.round(normalized.h * scaleY);

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setError("无法创建画布上下文");
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      setCroppedSrc(canvas.toDataURL("image/png"));
      setError("");
    };
    img.onerror = () => setError("图片裁剪失败");
    img.src = imageSrc;
  };

  const handleDownload = () => {
    if (!croppedSrc) {
      setError("没有可保存的裁剪结果");
      return;
    }

    const link = document.createElement("a");
    link.download = "cropped_image.png";
    link.href = croppedSrc;
    link.click();
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedSrc(null);
    setCropRect(null);
    setError("");
    setDisplaySize({ width: 0, height: 0 });
    setOriginalSize({ width: 0, height: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const normalizedRect = cropRect ? normalizeRect(cropRect) : null;

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">图片裁剪工具</h2>
        <p className="text-muted-foreground text-lg">
          选择图片并拖动矩形框裁剪
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={triggerFileInput}
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
                  <p className="font-medium">点击加载图片</p>
                  <p className="text-sm text-muted-foreground">
                    支持 JPG, PNG, GIF, WebP 等格式
                  </p>
                </div>
              </div>
            </div>

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
            {imageSrc ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  拖动选择裁剪区域
                </p>
                <div
                  className="relative rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden"
                  style={{ width: displaySize.width, height: displaySize.height }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="原图"
                    className="block select-none"
                    style={{ width: displaySize.width, height: displaySize.height }}
                    draggable={false}
                  />
                  {normalizedRect && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                      style={{
                        left: normalizedRect.x,
                        top: normalizedRect.y,
                        width: normalizedRect.w,
                        height: normalizedRect.h,
                      }}
                    />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  原始尺寸: {originalSize.width} × {originalSize.height} px
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-black/10 dark:border-white/10 p-6 text-sm text-muted-foreground">
                先加载图片后开始裁剪
              </div>
            )}

            <button
              onClick={handleCrop}
              disabled={!imageSrc}
              className={cn(
                "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                imageSrc
                  ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Crop className="w-4 h-4" />
              生成裁剪结果
            </button>

            <button
              onClick={handleDownload}
              disabled={!croppedSrc}
              className={cn(
                "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                croppedSrc
                  ? "bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md shadow-green-500/20"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Download className="w-4 h-4" />
              保存裁剪结果
            </button>

            {croppedSrc && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">裁剪预览</p>
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3">
                  <img
                    src={croppedSrc}
                    alt="裁剪结果"
                    className="max-w-full max-h-64 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 点击“选择图片”加载图片</li>
            <li>• 在图片上拖动鼠标绘制矩形裁剪框</li>
            <li>• 点击“生成裁剪结果”查看预览</li>
            <li>• 点击“保存裁剪结果”下载 PNG 文件</li>
          </ul>
        </div>
      </div>
    </>
  );
}
