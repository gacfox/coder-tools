'use client';

import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [error, setError] = useState('');
  const [displayWidth, setDisplayWidth] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
      const img = new Image();
      const src = e.target?.result as string;

      img.onload = () => {
        setImageSrc(src);
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setNewWidth(img.width);
        setNewHeight(img.height);

        // Calculate display dimensions to fit in the container
        const maxWidth = 320; // max-width of the container
        const maxHeight = 320; // max-height of the container

        let displayW = img.width;
        let displayH = img.height;

        // Scale down if necessary to fit container
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

        setDisplayWidth(displayW);
        setDisplayHeight(displayH);
      };

      img.onerror = () => {
        setError('图片加载失败');
      };

      img.src = src;
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

  const handleScale = () => {
    if (!imageSrc) {
      setError('请先上传图片');
      return;
    }
    
    if (newWidth <= 0 || newHeight <= 0) {
      setError('宽度和高度必须大于0');
      return;
    }
    
    setError('');
  };


  const handleDownload = () => {
    if (!imageSrc) {
      setError('没有可下载的图片');
      return;
    }

    // Create a canvas to draw the processed image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('无法创建画布上下文');
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Use new dimensions for scaling
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the scaled image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Create download link
      const link = document.createElement('a');
      link.download = 'processed_image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.onerror = () => {
      setError('图片处理失败');
    };

    img.src = imageSrc;
  };

  const handleReset = () => {
    setImageSrc(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setNewWidth(0);
    setNewHeight(0);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScaleByPercentage = (percentage: number) => {
    if (originalWidth > 0 && originalHeight > 0) {
      setNewWidth(Math.round(originalWidth * percentage / 100));
      setNewHeight(Math.round(originalHeight * percentage / 100));
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">图片缩放工具</h2>
        <p className="text-muted-foreground text-lg">
          调整图片尺寸
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
                    <div
                      className="border border-black/10 dark:border-white/10 rounded-xl p-4 bg-black/5 dark:bg-white/5 relative overflow-hidden"
                      style={{ width: `${displayWidth + 32}px`, height: `${displayHeight + 32}px` }} // 32px = 2*16px padding
                    >
                      <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Uploaded"
                        className="max-h-80 rounded-lg object-contain w-full"
                        style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
                      />
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground">
                      原始尺寸: {originalWidth} × {originalHeight} px
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
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重置
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
                <h3 className="font-medium">缩放设置</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">宽度 (px)</label>
                    <input
                      type="number"
                      value={newWidth || ''}
                      onChange={(e) => setNewWidth(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">高度 (px)</label>
                    <input
                      type="number"
                      value={newHeight || ''}
                      onChange={(e) => setNewHeight(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">常用比例</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleScaleByPercentage(25)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => handleScaleByPercentage(50)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => handleScaleByPercentage(75)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => handleScaleByPercentage(100)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      100%
                    </button>
                    <button
                      onClick={() => handleScaleByPercentage(150)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      150%
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleScale}
                  disabled={!imageSrc}
                  className={cn(
                    "w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2",
                    imageSrc
                      ? "bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  应用缩放
                </button>
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
                下载处理结果
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 点击上传区域或"选择图片"按钮上传要处理的图片</li>
            <li>• 在缩放设置中调整图片的宽度和高度，或选择常用比例</li>
            <li>• 点击"应用缩放"按钮预览缩放效果</li>
            <li>• 点击"下载处理结果"保存处理后的图片</li>
          </ul>
        </div>
      </div>
    </>
  );
}