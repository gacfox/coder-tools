'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Palette, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function AsciiArtGenerator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [style, setStyle] = useState<'default' | 'blocks' | 'shades' | 'simple'>('default');
  const [width, setWidth] = useState<number>(80);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError('请选择有效的图片文件（如 JPG, PNG, GIF 等）');
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setAsciiArt(''); // Clear previous ASCII art
    };

    reader.onerror = () => {
      setError('文件读取失败');
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generateAsciiArt = () => {
    if (!imageSrc) {
      setError('请先上传图片');
      return;
    }

    setIsGenerating(true);
    setError('');

    const img = new Image();
    img.onload = () => {
      // Create a temporary canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('无法创建画布上下文');
        setIsGenerating(false);
        return;
      }

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Generate ASCII art
      const asciiChars = getAsciiChars(style);
      const aspectRatio = img.height / img.width;
      const newHeight = Math.floor(width * aspectRatio * 0.55); // 0.55 is a factor to account for character height/width ratio

      let asciiResult = '';
      const imgData = imageData.data;

      for (let y = 0; y < newHeight; y++) {
        let line = '';
        for (let x = 0; x < width; x++) {
          // Map ASCII coordinates to image coordinates
          const imgX = Math.floor(x * img.width / width);
          const imgY = Math.floor(y * img.height / newHeight);

          // Get pixel index
          const pixelIndex = (imgY * img.width + imgX) * 4; // 4 channels per pixel

          // Get RGB values
          const r = imgData[pixelIndex];
          const g = imgData[pixelIndex + 1];
          const b = imgData[pixelIndex + 2];

          // Calculate grayscale value
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          // Map grayscale to ASCII character
          const charIndex = Math.floor(gray / 255 * (asciiChars.length - 1));
          line += asciiChars[asciiChars.length - 1 - charIndex]; // Reverse so darker chars are used for darker pixels
        }
        asciiResult += line + '\n';
      }

      setAsciiArt(asciiResult);
      setIsGenerating(false);
    };

    img.onerror = () => {
      setError('图片加载失败');
      setIsGenerating(false);
    };

    img.src = imageSrc;
  };

  const getAsciiChars = (style: string): string[] => {
    switch (style) {
      case 'blocks':
        return [' ', '▖', '▞', '▛', '█']; // Different block characters
      case 'shades':
        return [' ', '░', '▒', '▓', '█']; // Shade characters
      case 'simple':
        return [' ', '.', '*', 'O', '@'];
      default: // default
        return ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
    }
  };

  const downloadAsciiArt = () => {
    if (!asciiArt) {
      setError('没有可下载的ASCII Art');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([asciiArt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'ascii-art.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    if (!asciiArt) return;
    
    navigator.clipboard.writeText(asciiArt);
    setError('已复制到剪贴板！');
    setTimeout(() => setError(''), 2000);
  };

  const resetGenerator = () => {
    setImageSrc(null);
    setAsciiArt('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ASCII Art生成器</h2>
        <p className="text-muted-foreground text-lg">
          将图片转换为ASCII Art
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
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
                      <p className="font-medium">点击上传图片</p>
                      <p className="text-sm text-muted-foreground">支持 JPG, PNG, GIF, WebP 等格式</p>
                    </div>
                  </div>
                </div>

                {imageSrc && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">上传的图片</p>
                    <div className="border border-black/10 dark:border-white/10 rounded-xl p-4 bg-black/5 dark:bg-white/5">
                      <img
                        src={imageSrc}
                        alt="Uploaded preview"
                        className="max-h-60 rounded-lg object-contain w-full"
                      />
                    </div>
                  </div>
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
                    onClick={resetGenerator}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重置
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">生成设置</h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">宽度 (字符数)</label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>20</span>
                      <span>{width}</span>
                      <span>200</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">风格</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setStyle('default')}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                          style === 'default'
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        默认
                      </button>
                      <button
                        onClick={() => setStyle('blocks')}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                          style === 'blocks'
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        块状
                      </button>
                      <button
                        onClick={() => setStyle('shades')}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                          style === 'shades'
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        阴影
                      </button>
                      <button
                        onClick={() => setStyle('simple')}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                          style === 'simple'
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        简单
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={generateAsciiArt}
                    disabled={!imageSrc || isGenerating}
                    className={cn(
                      "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                      imageSrc && !isGenerating
                        ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
                        : "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        生成中...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        生成ASCII Art
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">ASCII Art结果</h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">生成的ASCII Art</label>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        disabled={!asciiArt}
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm flex items-center gap-1",
                          asciiArt
                            ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                            : "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Upload className="w-3 h-3" />
                        复制
                      </button>
                      <button
                        onClick={downloadAsciiArt}
                        disabled={!asciiArt}
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm flex items-center gap-1",
                          asciiArt
                            ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                            : "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Download className="w-3 h-3" />
                        下载
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 max-h-96 overflow-auto font-mono text-xs leading-3 whitespace-pre">
                    {asciiArt || (
                      <div className="text-center text-muted-foreground py-8">
                        {imageSrc ? '点击"生成ASCII Art"按钮开始转换' : '请先上传图片'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 点击上传区域或"选择图片"按钮上传要转换的图片</li>
            <li>• 调整宽度设置以控制ASCII Art的精细程度</li>
            <li>• 选择不同的风格以获得不同的视觉效果</li>
            <li>• 点击"生成ASCII Art"按钮开始转换</li>
            <li>• 转换完成后可以复制或下载生成的ASCII Art</li>
          </ul>
        </div>
      </div>
    </>
  );
}