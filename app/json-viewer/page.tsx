'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, Eye, Code, AlignLeft, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactJson from '@uiw/react-json-view';

export default function JsonViewer() {
  const [jsonText, setJsonText] = useState('');
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text');
  const [debouncedText, setDebouncedText] = useState(jsonText);

  // Debounce the text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(jsonText);
    }, 300);

    return () => clearTimeout(timer);
  }, [jsonText]);

  // Validate when debounced text changes
  useEffect(() => {
    if (debouncedText) {
      validateJson();
    }
  }, [debouncedText]);

  const formatJson = () => {
    try {
      setError('');
      const parsed = JSON.parse(jsonText);
      setParsedJson(parsed);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setError(`格式化失败: ${err.message}`);
      setParsedJson(null);
    }
  };

  const compressJson = () => {
    try {
      setError('');
      const parsed = JSON.parse(jsonText);
      setParsedJson(parsed);
      setJsonText(JSON.stringify(parsed));
    } catch (err: any) {
      setError(`压缩失败: ${err.message}`);
      setParsedJson(null);
    }
  };

  const validateJson = () => {
    if (!jsonText.trim()) {
      setError('JSON内容不能为空');
      setParsedJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      setError('');
      setParsedJson(parsed);
    } catch (err: any) {
      // Try to extract line number and context from error message
      let errorMessage = err.message;

      // Attempt to find line/column information in the error
      const match = errorMessage.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = jsonText.split('\n');
        let currentPos = 0;
        let lineNum = 0;

        for (let i = 0; i < lines.length; i++) {
          const lineLength = lines[i].length + 1; // +1 for newline
          if (currentPos + lineLength > position) {
            lineNum = i + 1;
            break;
          }
          currentPos += lineLength;
        }

        errorMessage = `JSON解析错误: ${err.message} (位置: 第${lineNum}行附近)`;
      }

      setError(errorMessage);
      setParsedJson(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'json_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);

    // Clear error immediately if there's text
    if (newText.trim()) {
      setError('');
    }
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">JSON预览器</h2>
        <p className="text-muted-foreground text-lg">
          JSON格式化、压缩与树形预览
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={formatJson}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              美化
            </button>
            <button
              onClick={compressJson}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Minus className="w-4 h-4" />
              压缩
            </button>
            <div className="flex border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('text')}
                className={cn(
                  "px-4 py-2 font-medium transition-colors",
                  viewMode === 'text'
                    ? "bg-blue-500 text-white"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" />
                  文本视图
                </div>
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={cn(
                  "px-4 py-2 font-medium transition-colors",
                  viewMode === 'tree'
                    ? "bg-blue-500 text-white"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  树形视图
                </div>
              </button>
            </div>
            <button
              onClick={() => copyToClipboard(jsonText)}
              disabled={!jsonText}
              className={cn(
                "px-4 py-2 rounded-xl font-medium flex items-center gap-2",
                jsonText
                  ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Copy className="w-4 h-4" />
              复制
            </button>
            <button
              onClick={downloadJson}
              disabled={!jsonText}
              className={cn(
                "px-4 py-2 rounded-xl font-medium flex items-center gap-2",
                jsonText
                  ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Download className="w-4 h-4" />
              下载
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {viewMode === 'text' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">JSON文本</label>
              </div>
              <textarea
                value={jsonText}
                onChange={handleTextChange}
                placeholder="请输入或粘贴JSON文本..."
                className="w-full h-96 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">树形视图</label>
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 min-h-[400px]">
                {parsedJson ? (
                  <ReactJson
                    value={parsedJson}
                    style={{
                      backgroundColor: 'transparent',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}
                    indentWidth={2}
                    collapsed={false}
                    displayDataTypes={false}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {jsonText ? '无效的JSON格式，无法显示树形视图' : '请输入JSON数据以预览'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 在文本视图中输入或粘贴JSON数据</li>
            <li>• 点击"美化"按钮格式化JSON，使其更易读</li>
            <li>• 点击"压缩"按钮移除所有不必要的空白字符</li>
            <li>• 使用"文本视图"和"树形视图"按钮切换视图模式</li>
            <li>• 树形视图提供结构化的JSON数据预览（只读）</li>
            <li>• 如有语法错误，将在上方显示详细的错误信息</li>
          </ul>
        </div>
      </div>
    </>
  );
}