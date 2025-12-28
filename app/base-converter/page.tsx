import { useState, useEffect } from 'react';
import { Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BaseConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState<2 | 8 | 10 | 16>(10);
  const [binary, setBinary] = useState('');
  const [octal, setOctal] = useState('');
  const [decimal, setDecimal] = useState('');
  const [hexadecimal, setHexadecimal] = useState('');
  const [error, setError] = useState('');

  const validateInput = (value: string, base: number): boolean => {
    if (!value) return true; // Allow empty input

    const validChars = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-Fa-f]+$/
    };

    return validChars[base as keyof typeof validChars].test(value);
  };

  const convert = () => {
    if (!inputValue.trim()) {
      setBinary('');
      setOctal('');
      setDecimal('');
      setHexadecimal('');
      setError('');
      return;
    }

    if (!validateInput(inputValue, inputBase)) {
      setError(`输入的值 "${inputValue}" 不是有效的${inputBase === 2 ? '二进制' : inputBase === 8 ? '八进制' : inputBase === 10 ? '十进制' : '十六进制'}数`);
      return;
    }

    try {
      // Convert input to decimal first
      const decimalValue = parseInt(inputValue, inputBase);

      if (isNaN(decimalValue)) {
        setError('输入的值无法解析为有效数字');
        return;
      }

      // Check if the number is negative
      if (decimalValue < 0) {
        setError('请输入非负整数');
        return;
      }

      // Convert to all bases
      setBinary(decimalValue.toString(2));
      setOctal(decimalValue.toString(8));
      setDecimal(decimalValue.toString(10));
      setHexadecimal(decimalValue.toString(16).toUpperCase());
      setError('');
    } catch (err) {
      setError('转换失败：输入的值无法解析为有效数字');
    }
  };

  // Convert when input value or input base changes
  useEffect(() => {
    convert();
  }, [inputValue, inputBase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Only validate if there's a value
    if (value && !validateInput(value, inputBase)) {
      setError(`输入的值 "${value}" 不是有效的${inputBase === 2 ? '二进制' : inputBase === 8 ? '八进制' : inputBase === 10 ? '十进制' : '十六进制'}数`);
    } else {
      setError('');
    }
  };

  const handleBaseChange = (base: 2 | 8 | 10 | 16) => {
    setInputBase(base);
    if (inputValue) {
      // Re-validate with new base
      if (!validateInput(inputValue, base)) {
        setError(`输入的值 "${inputValue}" 不是有效的${base === 2 ? '二进制' : base === 8 ? '八进制' : base === 10 ? '十进制' : '十六进制'}数`);
      } else {
        setError('');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const downloadResults = () => {
    const content = `进制转换结果：
二进制: ${binary}
八进制: ${octal}
十进制: ${decimal}
十六进制: ${hexadecimal}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'base_conversion_results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputValue('');
    setBinary('');
    setOctal('');
    setDecimal('');
    setHexadecimal('');
    setError('');
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">进制转换工具</h2>
        <p className="text-muted-foreground text-lg">
          二进制、八进制、十进制、十六进制之间的相互转换
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">输入值</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="请输入数值..."
                className="flex-1 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleBaseChange(2)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all min-w-[60px]",
                    inputBase === 2
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  二进制
                </button>
                <button
                  onClick={() => handleBaseChange(8)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all min-w-[60px]",
                    inputBase === 8
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  八进制
                </button>
                <button
                  onClick={() => handleBaseChange(10)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all min-w-[60px]",
                    inputBase === 10
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  十进制
                </button>
                <button
                  onClick={() => handleBaseChange(16)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all min-w-[60px]",
                    inputBase === 16
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  十六进制
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">二进制 (Base 2)</label>
                <button
                  onClick={() => copyToClipboard(binary)}
                  disabled={!binary}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    binary
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  复制
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                {binary || '-'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">八进制 (Base 8)</label>
                <button
                  onClick={() => copyToClipboard(octal)}
                  disabled={!octal}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    octal
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  复制
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                {octal || '-'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">十进制 (Base 10)</label>
                <button
                  onClick={() => copyToClipboard(decimal)}
                  disabled={!decimal}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    decimal
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  复制
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                {decimal || '-'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">十六进制 (Base 16)</label>
                <button
                  onClick={() => copyToClipboard(hexadecimal)}
                  disabled={!hexadecimal}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    hexadecimal
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  复制
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                {hexadecimal || '-'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={downloadResults}
              disabled={!binary && !octal && !decimal && !hexadecimal}
              className={cn(
                "px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2",
                binary || octal || decimal || hexadecimal
                  ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Download className="w-4 h-4" />
              下载结果
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              清空
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <h3 className="font-medium mb-3">使用说明</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• 选择输入数值的进制格式（二进制、八进制、十进制或十六进制）</li>
            <li>• 系统会自动将输入值转换为其他所有进制格式</li>
            <li>• 转换结果会实时显示在对应进制的框中</li>
            <li>• 点击"复制"按钮可复制对应进制的转换结果</li>
          </ul>
        </div>
      </div>
    </>
  );
}