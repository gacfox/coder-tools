"use client";

import { useState } from "react";
import { Copy, RotateCcw, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { JSONPath } from "jsonpath-plus";

type MatchItem = { path: string; value: unknown };

export default function JsonPathTester() {
  const [jsonInput, setJsonInput] = useState('{\n  "store": {\n    "book": [\n      { "category": "reference", "title": "Sayings", "price": 8.95 },\n      { "category": "fiction", "title": "Sword", "price": 12.99 }\n    ]\n  }\n}');
  const [pathInput, setPathInput] = useState("$.store.book[*].title");
  const [pathsOutput, setPathsOutput] = useState("");
  const [valuesOutput, setValuesOutput] = useState("");
  const [error, setError] = useState("");

  const handleRun = () => {
    try {
      const jsonValue = JSON.parse(jsonInput);
      const matches = JSONPath({
        path: pathInput,
        json: jsonValue,
        resultType: "all",
      }) as Array<{ path: string | (string | number)[]; value: unknown }>;

      const normalized: MatchItem[] = matches.map((item) => ({
        path: Array.isArray(item.path) ? item.path.join(".") : String(item.path),
        value: item.value,
      }));

      setPathsOutput(normalized.map((item) => item.path).join("\n"));
      setValuesOutput(JSON.stringify(normalized.map((item) => item.value), null, 2));
      setError("");
    } catch (err) {
      setError("解析失败：请检查 JSON 或 JSONPath 表达式");
      setPathsOutput("");
      setValuesOutput("");
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setPathInput("");
    setPathsOutput("");
    setValuesOutput("");
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">JSONPath测试</h2>
        <p className="text-muted-foreground text-lg">
          输入 JSONPath 表达式与 JSON，查看匹配路径与结果
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-4 mb-6">
          <label className="text-sm font-medium text-muted-foreground">
            JSONPath 表达式
          </label>
          <input
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="例如：$.store.book[*].title"
            className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                JSON 输入
              </label>
              <button
                onClick={() => copyToClipboard(jsonInput)}
                className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Copy className="w-3 h-3 inline mr-1" />
                复制
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="请输入 JSON..."
              className="w-full h-64 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  匹配路径
                </label>
                <button
                  onClick={() => copyToClipboard(pathsOutput)}
                  disabled={!pathsOutput}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    pathsOutput
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
              </div>
              <textarea
                value={pathsOutput}
                readOnly
                placeholder="匹配路径将显示在这里..."
                className="w-full h-28 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  匹配结果
                </label>
                <button
                  onClick={() => copyToClipboard(valuesOutput)}
                  disabled={!valuesOutput}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    valuesOutput
                      ? "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Copy className="w-3 h-3 inline mr-1" />
                  复制
                </button>
              </div>
              <textarea
                value={valuesOutput}
                readOnly
                placeholder="匹配结果将显示在这里..."
                className="w-full h-28 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleRun}
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            运行
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>
      </div>
    </>
  );
}
