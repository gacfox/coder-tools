import { useState } from 'react';
import { Copy, RotateCcw, Download, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UrlEncoderDecoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

  const handleEncode = () => {
    try {
      setError('');
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
    } catch (err) {
      setError('编码失败：输入内容无法进行URL编码');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
    } catch (err) {
      setError('解码失败：输入内容不是有效的URL编码格式');
      setOutputText('');
    }
  };

  const handleConvert = () => {
    if (activeTab === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setError('');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${activeTab === 'encode' ? 'encoded' : 'decoded'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">URL编解码转换工具</h2>
        <p className="text-muted-foreground text-lg">
          URL编码与解码之间的相互转换
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
            URL编码
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
            URL解码
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === 'encode' ? '输入原文' : '输入编码'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(inputText)}
                  className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={activeTab === 'encode' ? '请输入要进行URL编码的文本...' : '请输入要进行URL解码的编码字符串...'}
              className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === 'encode' ? '输出编码' : '输出原文'}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(outputText)}
                  disabled={!outputText}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    outputText 
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
                <button
                  onClick={downloadOutput}
                  disabled={!outputText}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    outputText 
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10" 
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Download className="w-3 h-3 inline mr-1" />
                  下载
                </button>
              </div>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder={activeTab === 'encode' ? '编码后的URL将显示在这里...' : '解码后的原文将显示在这里...'}
              className="w-full h-48 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
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
            {activeTab === 'encode' ? 'URL编码' : 'URL解码'}
          </button>
          <button
            onClick={handleSwap}
            disabled={!outputText}
            className={cn(
              "px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2",
              outputText
                ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                : "opacity-50 cursor-not-allowed"
            )}
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
            <li>• URL编码：将特殊字符转换为%编码格式，用于URL传输</li>
            <li>• URL解码：将%编码格式还原为原始字符</li>
            <li>• 点击"交换内容"可快速将输出内容复制到输入框</li>
            <li>• 支持复制和下载转换结果</li>
          </ul>
        </div>
      </div>
    </>
  );
}