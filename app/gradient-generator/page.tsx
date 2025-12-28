'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorStop {
  id: string;
  color: string;
  position: number; // 0 to 100
}

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90); // For linear gradients
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#ff0000', position: 0 },
    { id: '2', color: '#0000ff', position: 100 },
  ]);
  const [selectedColorStop, setSelectedColorStop] = useState<string | null>('1');
  const [cssCode, setCssCode] = useState('');

  // Generate CSS code whenever parameters change
  useEffect(() => {
    let gradientValue = '';
    
    if (gradientType === 'linear') {
      gradientValue = `linear-gradient(${angle}deg, ${colorStops
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ')})`;
    } else {
      gradientValue = `radial-gradient(circle, ${colorStops
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ')})`;
    }
    
    const code = `background: ${gradientValue};`;
    setCssCode(code);
  }, [gradientType, angle, colorStops]);

  const addColorStop = () => {
    const newId = Date.now().toString();
    const newPosition = 50; // Default to middle
    const newColor = '#ffffff'; // Default to white
    
    // Check if position is already taken
    let position = newPosition;
    while (colorStops.some(stop => stop.position === position)) {
      position = Math.min(100, Math.max(0, position + 5));
    }
    
    setColorStops([
      ...colorStops,
      { id: newId, color: newColor, position }
    ]);
    setSelectedColorStop(newId);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return; // Keep at least 2 stops
    
    const updatedStops = colorStops.filter(stop => stop.id !== id);
    setColorStops(updatedStops);
    
    if (selectedColorStop === id) {
      setSelectedColorStop(updatedStops[0]?.id || null);
    }
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(
      colorStops.map(stop => 
        stop.id === id ? { ...stop, ...updates } : stop
      )
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
  };

  const downloadCSS = () => {
    const blob = new Blob([cssCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedStop = colorStops.find(stop => stop.id === selectedColorStop);

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">渐变CSS生成器</h2>
        <p className="text-muted-foreground text-lg">
          创建自定义渐变并生成CSS代码
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setGradientType('linear')}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      gradientType === 'linear'
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    线性渐变
                  </button>
                  <button
                    onClick={() => setGradientType('radial')}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all",
                      gradientType === 'radial'
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    径向渐变
                  </button>
                </div>

                {gradientType === 'linear' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      角度: {angle}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">颜色节点</h3>
                  <button
                    onClick={addColorStop}
                    className="px-3 py-1.5 text-sm rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    添加节点
                  </button>
                </div>

                <div className="space-y-3">
                  {colorStops
                    .sort((a, b) => a.position - b.position)
                    .map((stop) => (
                      <div
                        key={stop.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border",
                          selectedColorStop === stop.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-black/10 dark:border-white/10"
                        )}
                        onClick={() => setSelectedColorStop(stop.id)}
                      >
                        <div
                          className="w-8 h-8 rounded-full border border-black/20 dark:border-white/20"
                          style={{ backgroundColor: stop.color }}
                        />
                        <div className="flex-1">
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                            className="w-8 h-8 border-0 rounded cursor-pointer"
                          />
                        </div>
                        <div className="w-16">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={stop.position}
                            onChange={(e) => updateColorStop(stop.id, { position: parseInt(e.target.value) || 0 })}
                            className="w-full p-1 rounded border border-black/10 dark:border-white/10"
                          />
                        </div>
                        <span className="text-muted-foreground text-sm">%</span>
                        {colorStops.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeColorStop(stop.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">预览</h3>
                <div
                  className="h-48 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden"
                  style={{
                    background: gradientType === 'linear'
                      ? `linear-gradient(${angle}deg, ${colorStops
                          .sort((a, b) => a.position - b.position)
                          .map(stop => `${stop.color} ${stop.position}%`)
                          .join(', ')})`
                      : `radial-gradient(circle, ${colorStops
                          .sort((a, b) => a.position - b.position)
                          .map(stop => `${stop.color} ${stop.position}%`)
                          .join(', ')})`
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">CSS代码</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </button>
                    <button
                      onClick={downloadCSS}
                      className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Download className="w-3 h-3" />
                      下载
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">{cssCode}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 选择渐变类型：线性渐变或径向渐变</li>
            <li>• 对于线性渐变，可以调整角度</li>
            <li>• 点击颜色节点可以编辑颜色和位置</li>
            <li>• 使用滑块调整颜色节点的位置（0-100%）</li>
            <li>• 点击"添加节点"可增加更多颜色节点</li>
            <li>• 点击"复制"或"下载"获取CSS代码</li>
          </ul>
        </div>
      </div>
    </>
  );
}