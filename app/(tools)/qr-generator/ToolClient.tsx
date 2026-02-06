'use client';

import { useState, useRef } from 'react';
import { Copy, Download, QrCode, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [qrValue, setQrValue] = useState('https://example.com');
  const [error, setError] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!text.trim()) {
      setError('请输入要生成二维码的文本');
      return;
    }

    setError('');
    setQrValue(text);
  };

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = document.createElement('canvas');
      const img = qrRef.current.querySelector('canvas, img') as HTMLImageElement | null;

      if (img) {
        canvas.width = img.width || size;
        canvas.height = img.height || size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          const link = document.createElement('a');
          link.download = 'qrcode.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setText('');
    setQrValue('');
    setError('');
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">二维码生成器</h2>
        <p className="text-muted-foreground text-lg">
          根据文本内容生成二维码
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">要生成二维码的文本</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="输入文本或URL..."
                    className="w-full h-32 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    生成二维码
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    复制文本
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    清空
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">尺寸 (px)</label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground">{size}px</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">前景色</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 border border-black/10 dark:border-white/10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">背景色</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 border border-black/10 dark:border-white/10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <h3 className="font-medium mb-2">生成的二维码</h3>
                <div
                  ref={qrRef}
                  className="p-4 bg-white rounded-xl inline-block"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCodeCanvas
                    value={qrValue}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                  />
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={!qrValue}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium flex items-center gap-2",
                  qrValue
                    ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                <Download className="w-4 h-4" />
                下载二维码
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 在文本框中输入要生成二维码的内容（支持文本、URL等）</li>
            <li>• 点击"生成二维码"按钮生成二维码</li>
            <li>• 可以调整二维码的尺寸、前景色和背景色</li>
            <li>• 点击"下载二维码"可保存生成的二维码图片</li>
          </ul>
        </div>
      </div>
    </>
  );
}