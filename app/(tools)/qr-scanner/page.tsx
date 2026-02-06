'use client';

import { useState, useRef } from 'react';
import { Upload, Download, QrCode, Copy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import jsQR from 'jsqr';

export default function QrScanner() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError('请选择有效的图片文件（如 JPG, PNG, GIF 等）');
      return;
    }

    setError('');
    setLoading(true);
    setResult('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(e.target?.result as string);
        
        // Process the image to scan for QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          try {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              setResult(code.data);
              setError('');
            } else {
              setError('未在图片中找到有效的二维码');
            }
          } catch (err) {
            setError('识别失败：无法解析图片中的二维码');
          }
        } else {
          setError('无法创建画布上下文');
        }
        
        setLoading(false);
      };
      
      img.onerror = () => {
        setError('图片加载失败');
        setLoading(false);
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      setError('文件读取失败');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  const downloadResult = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr_code_result.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearAll = () => {
    setImageSrc(null);
    setResult('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">二维码识别器</h2>
        <p className="text-muted-foreground text-lg">
          上传二维码图片，识别其中的内容
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
                      <p className="font-medium">点击上传二维码图片</p>
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
                        alt="Uploaded QR code" 
                        className="max-h-64 rounded-lg object-contain w-full"
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
                    onClick={clearAll}
                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    清空
                  </button>
                </div>
              </div>

              {loading && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                  正在识别二维码...
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">识别结果</label>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      disabled={!result}
                      className={cn(
                        "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                        result
                          ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                          : "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </button>
                    <button
                      onClick={downloadResult}
                      disabled={!result}
                      className={cn(
                        "text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1",
                        result
                          ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                          : "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Download className="w-3 h-3" />
                      下载
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 min-h-[200px]">
                  {result ? (
                    <div className="whitespace-pre-wrap break-words">
                      {result}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground italic">
                      识别结果将显示在这里
                    </div>
                  )}
                </div>
              </div>
              
              {result && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
                  二维码识别成功！
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 点击上传区域或"选择图片"按钮上传包含二维码的图片</li>
            <li>• 支持常见的图片格式：JPG, PNG, GIF, WebP 等</li>
            <li>• 系统会自动识别图片中的二维码内容</li>
            <li>• 识别结果会显示在右侧区域</li>
            <li>• 可以复制或下载识别到的内容</li>
          </ul>
        </div>
      </div>
    </>
  );
}