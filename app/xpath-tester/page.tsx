"use client";

import { useState } from "react";
import { Copy, RotateCcw, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type MatchItem = { path: string; value: string };

const getXPath = (node: Node): string => {
  if (node.nodeType === Node.DOCUMENT_NODE) return "/";
  if (node.nodeType === Node.TEXT_NODE) {
    const parentPath = node.parentNode ? getXPath(node.parentNode) : "";
    return `${parentPath}/text()`;
  }
  if (!(node instanceof Element)) return "";
  const siblings = Array.from(node.parentNode?.childNodes || []).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName === node.tagName
  );
  const index = siblings.indexOf(node) + 1;
  const parentPath = node.parentNode ? getXPath(node.parentNode) : "";
  return `${parentPath}/${node.tagName.toLowerCase()}[${index}]`;
};

export default function XPathTester() {
  const [xmlInput, setXmlInput] = useState(
    `<store>
  <book category="reference">
    <title>Sayings</title>
    <price>8.95</price>
  </book>
  <book category="fiction">
    <title>Sword</title>
    <price>12.99</price>
  </book>
</store>`
  );
  const [pathInput, setPathInput] = useState("//book/title");
  const [pathsOutput, setPathsOutput] = useState("");
  const [valuesOutput, setValuesOutput] = useState("");
  const [error, setError] = useState("");

  const handleRun = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlInput, "application/xml");
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        throw new Error("XML 解析失败");
      }

      const result = doc.evaluate(
        pathInput,
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      );

      const matches: MatchItem[] = [];
      switch (result.resultType) {
        case XPathResult.STRING_TYPE:
          matches.push({ path: pathInput, value: result.stringValue });
          break;
        case XPathResult.NUMBER_TYPE:
          matches.push({ path: pathInput, value: String(result.numberValue) });
          break;
        case XPathResult.BOOLEAN_TYPE:
          matches.push({ path: pathInput, value: String(result.booleanValue) });
          break;
        default: {
          let node = result.iterateNext();
          while (node) {
            matches.push({
              path: getXPath(node),
              value:
                node.nodeType === Node.ELEMENT_NODE
                  ? (node as Element).textContent?.trim() || ""
                  : node.nodeValue || "",
            });
            node = result.iterateNext();
          }
        }
      }

      setPathsOutput(matches.map((item) => item.path).join("\n"));
      setValuesOutput(JSON.stringify(matches.map((item) => item.value), null, 2));
      setError("");
    } catch (err) {
      setError("解析失败：请检查 XML 或 XPath 表达式");
      setPathsOutput("");
      setValuesOutput("");
    }
  };

  const handleClear = () => {
    setXmlInput("");
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
        <h2 className="text-3xl font-bold tracking-tight">XPath测试</h2>
        <p className="text-muted-foreground text-lg">
          输入 XPath 表达式与 XML，查看匹配路径与结果
        </p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/40">
        <div className="space-y-4 mb-6">
          <label className="text-sm font-medium text-muted-foreground">
            XPath 表达式
          </label>
          <input
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="例如：//book/title"
            className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                XML 输入
              </label>
              <button
                onClick={() => copyToClipboard(xmlInput)}
                className="text-xs px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <Copy className="w-3 h-3 inline mr-1" />
                复制
              </button>
            </div>
            <textarea
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
              placeholder="请输入 XML..."
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
