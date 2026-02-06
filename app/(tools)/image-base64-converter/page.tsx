'use client';

import { useState, useRef } from 'react';
import { Copy, RotateCcw, Download, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageBase64Converter() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [base64String, setBase64String] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const result = e.target?.result as string;
      setImageSrc(result);
      setBase64String(result); // The result is already in base64 format
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Input = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    setBase64String(value);
    
    // Validate if it's a valid base64 image string
    if (value) {
      try {
        // Check if it starts with data:image/...
        if (!value.startsWith('data:image/')) {
          setError('请输入有效的图片BASE64字符串（以 data:image/ 开头）');
          setImageSrc(null);
          return;
        }
        
        // Try to create an image to validate
        const img = new Image();
        img.src = value;
        img.onload = () => {
          setError('');
          setImageSrc(value);
        };
        img.onerror = () => {
          setError('解码失败：输入的BASE64字符串不是有效的图片格式');
          setImageSrc(null);
        };
      } catch (err) {
        setError('解码失败：输入的BASE64字符串格式不正确');
        setImageSrc(null);
      }
    } else {
      setImageSrc(null);
    }
  };

  const handleConvert = () => {
    if (activeTab === 'encode') {
      // In encode mode, we already have the base64 when image is uploaded
      // So we just need to ensure the image is loaded
      if (!imageSrc) {
        setError('请先上传一张图片');
      } else {
        setError('');
      }
    } else {
      // In decode mode, we validate the base64 string
      if (!base64String) {
        setError('请输入BASE64字符串');
        return;
      }
      
      try {
        // Check if it starts with data:image/...
        if (!base64String.startsWith('data:image/')) {
          setError('请输入有效的图片BASE64字符串（以 data:image/ 开头）');
          setImageSrc(null);
          return;
        }
        
        // Try to create an image to validate
        const img = new Image();
        img.src = base64String;
        img.onload = () => {
          setError('');
          setImageSrc(base64String);
        };
        img.onerror = () => {
          setError('解码失败：输入的BASE64字符串不是有效的图片格式');
          setImageSrc(null);
        };
      } catch (err) {
        setError('解码失败：输入的BASE64字符串格式不正确');
        setImageSrc(null);
      }
    }
  };

  const handleSwap = () => {
    if (activeTab === 'encode' && imageSrc) {
      // Switch to decode mode and set the base64 string as input
      setBase64String(imageSrc);
      setImageSrc(null);
      setActiveTab('decode');
    } else if (activeTab === 'decode' && base64String) {
      // Switch to encode mode and set the image as input
      setImageSrc(base64String);
      setBase64String('');
      setActiveTab('encode');
    }
  };

  const handleClear = () => {
    setImageSrc(null);
    setBase64String('');
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadImage = () => {
    if (!imageSrc) return;
    
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `converted_image.${getImageExtension(imageSrc)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadBase64 = () => {
    const blob = new Blob([base64String], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image_base64.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getImageExtension = (dataUrl: string): string => {
    const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/gif':
        return 'gif';
      case 'image/webp':
        return 'webp';
      case 'image/svg+xml':
        return 'svg';
      case 'image/bmp':
        return 'bmp';
      default:
        return 'jpg'; // default fallback
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">BASE64图片编解码工具</h2>
        <p className="text-muted-foreground text-lg">
          图片与BASE64格式之间的相互转换
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('encode')}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === 'encode'
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            图片转BASE64
          </button>
          <button
            onClick={() => setActiveTab('decode')}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === 'decode'
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            BASE64转图片
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === 'encode' ? '上传图片' : '输入BASE64'}
              </label>
              <div className="flex gap-2">
                {activeTab === 'encode' && imageSrc && (
                  <button
                    onClick={() => copyToClipboard(base64String)}
                    className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    复制
                  </button>
                )}
              </div>
            </div>
            
            {activeTab === 'encode' ? (
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
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
                    <p className="text-sm font-medium text-muted-foreground mb-2">预览图片</p>
                    <div className="border border-black/10 dark:border-white/10 rounded-xl p-4 bg-black/5 dark:bg-white/5">
                      <img 
                        src={imageSrc} 
                        alt="Preview" 
                        className="max-h-48 rounded-lg object-contain w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={base64String}
                onChange={handleBase64Input}
                placeholder="请输入以 data:image/ 开头的BASE64图片字符串..."
                className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-xs"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === 'encode' ? '输出BASE64' : '输出图片'}
              </label>
              <div className="flex gap-2">
                {activeTab === 'encode' && base64String && (
                  <button
                    onClick={downloadBase64}
                    className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-3 h-3 inline mr-1" />
                    下载
                  </button>
                )}
                {activeTab === 'decode' && imageSrc && (
                  <button
                    onClick={downloadImage}
                    className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-3 h-3 inline mr-1" />
                    下载
                  </button>
                )}
              </div>
            </div>
            
            {activeTab === 'encode' ? (
              <textarea
                value={base64String}
                readOnly
                placeholder="转换后的BASE64将显示在这里..."
                className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-xs"
              />
            ) : (
              <div className="space-y-4">
                {imageSrc ? (
                  <div className="border border-black/10 dark:border-white/10 rounded-xl p-4 bg-black/5 dark:bg-white/5">
                    <img 
                      src={imageSrc} 
                      alt="Converted" 
                      className="max-h-64 rounded-lg object-contain w-full"
                    />
                  </div>
                ) : (
                  <div className="border border-black/10 dark:border-white/10 rounded-xl p-8 text-center bg-black/5 dark:bg-white/5">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">解码后的图片将显示在这里</p>
                  </div>
                )}
              </div>
            )}
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
            {activeTab === 'encode' ? '转换为BASE64' : '解码图片'}
          </button>
          <button
            onClick={handleSwap}
            className="px-6 py-2.5 rounded-xl font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            交换内容
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            清空
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 图片转BASE64：上传图片文件，获取对应的BASE64编码</li>
            <li>• BASE64转图片：输入有效的图片BASE64字符串（以 data:image/ 开头），预览图片</li>
            <li>• 支持常见的图片格式：JPG, PNG, GIF, WebP 等</li>
            <li>• 点击"交换内容"可在编码和解码模式间切换</li>
          </ul>
        </div>
      </div>
    </>
  );
}