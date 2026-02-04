"use client";

import { useState } from "react";
import { Copy, RotateCcw, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const ROMAN_MAP: Array<{ value: number; symbol: string }> = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
];

const ROMAN_REGEX =
  /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

const toRoman = (num: number) => {
  let value = num;
  let result = "";
  for (const item of ROMAN_MAP) {
    while (value >= item.value) {
      result += item.symbol;
      value -= item.value;
    }
  }
  return result;
};

const fromRoman = (input: string) => {
  const roman = input.toUpperCase();
  let index = 0;
  let total = 0;
  while (index < roman.length) {
    const pair = roman.slice(index, index + 2);
    const single = roman.slice(index, index + 1);
    const pairValue = ROMAN_MAP.find((item) => item.symbol === pair)?.value;
    if (pairValue) {
      total += pairValue;
      index += 2;
      continue;
    }
    const singleValue = ROMAN_MAP.find((item) => item.symbol === single)?.value;
    if (!singleValue) return null;
    total += singleValue;
    index += 1;
  }
  return total;
};

export default function RomanNumeralConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"number" | "roman">("number");

  const handleConvert = () => {
    if (!inputText.trim()) {
      setOutputText("");
      setError("");
      return;
    }

    if (activeTab === "number") {
      const value = Number(inputText.trim());
      if (!Number.isInteger(value) || value < 1 || value > 3999) {
        setError("请输入 1-3999 的整数");
        setOutputText("");
        return;
      }
      setOutputText(toRoman(value));
      setError("");
      return;
    }

    const roman = inputText.trim();
    if (!ROMAN_REGEX.test(roman)) {
      setError("请输入有效的罗马数字（I~MMMCMXCIX）");
      setOutputText("");
      return;
    }
    const value = fromRoman(roman);
    if (!value || value < 1 || value > 3999) {
      setError("罗马数字超出范围");
      setOutputText("");
      return;
    }
    setOutputText(String(value));
    setError("");
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setError("");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roman_${activeTab === "number" ? "converted" : "decoded"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">罗马数字转换器</h2>
        <p className="text-muted-foreground text-lg">
          支持 1-3999 数字与罗马数字互转
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("number")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === "number"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            数字转罗马
          </button>
          <button
            onClick={() => setActiveTab("roman")}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              activeTab === "roman"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            罗马转数字
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === "number" ? "输入数字" : "输入罗马数字"}
              </label>
              <button
                onClick={() => copyToClipboard(inputText)}
                className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Copy className="w-3 h-3 inline mr-1" />
                复制
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "number"
                  ? "请输入 1-3999 的整数..."
                  : "例如：XIV 或 MMMCMXCIX"
              }
              className="w-full h-40 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {activeTab === "number" ? "输出罗马数字" : "输出数字"}
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
              placeholder="转换结果会显示在这里..."
              className="w-full h-40 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
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
            转换
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
            <li>• 支持 1-3999 的整数转换</li>
            <li>• 罗马数字支持大小写输入</li>
            <li>• 使用标准罗马数字规则（如 IV, IX, XL, CM）</li>
          </ul>
        </div>
      </div>
    </>
  );
}
